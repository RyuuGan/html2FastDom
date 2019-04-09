import { Component, FastDomNode, fdObject, Observer } from 'faster-dom';
import * as parse5 from 'parse5';
import { isElementNode, isTextNode } from 'parse5/lib/tree-adapters/default';
import { CompilerErrorReactive, CompilerErrorAttr } from './compilerError';

export class HtmlToFastDomCompiler {
  documentRoot: parse5.DefaultTreeDocumentFragment;

  constructor(public html: string) {
    this.documentRoot = parse5.parseFragment(html) as any;
  }

  compile(component: Component): FastDomNode;
  compile(): (component: Component) => FastDomNode;
  compile(component?: Component) {
    if (component) {
      return this._compile(component);
    }
    return (cmp: Component) => {
      this._compile(cmp);
    };
  }

  private isTextNode(
    node: parse5.DefaultTreeNode
  ): node is parse5.DefaultTreeTextNode {
    return isTextNode(node);
  }

  private isElementNode(
    node: parse5.DefaultTreeNode
  ): node is parse5.DefaultTreeElement {
    return isElementNode(node);
  }

  private isDocumentFragment(
    node: parse5.DefaultTreeNode
  ): node is parse5.DefaultTreeDocumentFragment {
    return node.nodeName === '#document-fragment';
  }

  private isFdFor(node: parse5.DefaultTreeElement): boolean {
    const fdForIdx = node.attrs.findIndex(
      attr => attr.name === 'fd-for' || attr.name === 'fdfor'
    );
    return fdForIdx > -1;
  }

  private _compile(component: Component) {
    if (this.documentRoot.childNodes.length > 1) {
      const [rootNode] = this.processNode(this.documentRoot, component);
      rootNode.tag = 'div';
      return rootNode;
    }
    const root = this.documentRoot.childNodes[0];
    if (!root || (!this.isElementNode(root) && !this.isTextNode(root))) {
      return {
        tag: 'textNode',
        textValue: ''
      };
    }
    return this.processNode(root, component)[0];
  }

  processNode(
    node: parse5.DefaultTreeNode,
    component: Component
  ): FastDomNode[] {
    if (this.isTextNode(node)) {
      return [
        {
          tag: 'textNode',
          textValue: this.processReactiveValue(node.value, component)
        }
      ];
    }
    if (!this.isElementNode(node) && !this.isDocumentFragment(node)) {
      return null;
    }
    if (this.isDocumentFragment(node)) {
      return [
        {
          tag: null,
          children: this.processChildren(node, component)
        }
      ];
    }
    if (this.isFdFor(node)) {
      return this.processNodeFdFor(node, component);
    }
    const attrs = this.processAttrs(node, component);
    if (node.childNodes.length === 1 && this.isTextNode(node.childNodes[0])) {
      return [
        {
          tag: node.tagName.toLowerCase(),
          textValue: this.processReactiveValue(
            (node.childNodes[0] as parse5.DefaultTreeTextNode).value,
            component
          ),
          ...attrs
        }
      ];
    }
    if (node.childNodes.length === 0) {
      return [
        {
          tag: node.tagName.toLowerCase(),
          ...attrs
        }
      ];
    }
    return [
      {
        tag: node.tagName.toLowerCase(),
        ...attrs,
        children: this.processChildren(node, component)
      }
    ];
  }

  private processChildren(
    node: parse5.DefaultTreeElement | parse5.DefaultTreeDocumentFragment,
    component: Component
  ) {
    return Array.from(node.childNodes)
      .map(child => this.processNode(child, component))
      .reduce((memo, arr) => memo.concat(arr));
  }

  private getReactiveName(input: string): string | null {
    const groups = input.match(/^\{\{\s*(.*)\s*\}\}$/);
    return groups && groups[1];
  }

  private processReactiveValue(
    input: string,
    component: Component,
    reactiveType?: 'reactive'
  ): string | Observer<any>;
  private processReactiveValue(
    input: string,
    component: Component,
    reactiveType: 'fdStyles'
  ): fdObject<any> | Observer<string>;
  private processReactiveValue(
    input: string,
    component: Component,
    reactiveType: 'fdObjects'
  ): fdObject<any>;
  private processReactiveValue(
    input: string,
    component: Component,
    reactiveType: 'reactive' | 'fdObjects' | 'fdStyles' = 'reactive'
  ) {
    const name = this.getReactiveName(input);
    if (name) {
      if (!(name in component[reactiveType])) {
        throw new CompilerErrorReactive(component, reactiveType, name);
      }
      return component[reactiveType][name];
    }
    return input;
  }

  private processAttrs(
    node: parse5.DefaultTreeElement,
    component: Component
  ): any {
    const data = node.attrs.reduce(
      (memo, attr) => {
        if (attr.name.startsWith('fdfor') || attr.name.startsWith('fd-for')) {
          return memo;
        }
        if (attr.name === 'value') {
          return this.processAttributeValue(attr, memo, component);
        }
        if (attr.name === 'style') {
          return this.processAttributeStyle(attr, memo, component);
        }
        if (attr.name === 'class') {
          return this.processAttributeClass(attr, memo, component);
        }
        // fdIf
        if (attr.name === 'fdif' || attr.name === 'fd-if') {
          return this.processAttributeFdIf(attr, memo, component);
        }
        const attrs = memo.attrs || {};
        attrs[attr.name] = this.processReactiveValue(attr.value, component);
        return {
          ...memo,
          attrs
        };
      },
      {} as any
    );
    if (data.attrs && Object.keys(data.attrs).length) {
      data.attrs = new fdObject(data.attrs);
    }

    if (data.props && Object.keys(data.props).length) {
      data.props = new fdObject(data.props);
    }

    return data;
  }

  private processAttributeFdIf(
    attr: parse5.Attribute,
    memo: any,
    component: Component
  ) {
    const name = this.getReactiveName(attr.value);
    if (!name || !(name in component.reactive)) {
      throw new CompilerErrorReactive(component, 'reactive', attr.name);
    }
    return {
      ...memo,
      show: component.reactive[name]
    };
  }

  private processAttributeClass(
    attr: parse5.Attribute,
    memo: any,
    component: Component
  ) {
    const attrValue = attr.value;
    const reactiveName = this.getReactiveName(attrValue);

    if (reactiveName) {
      return {
        ...memo,
        classList: this.processReactiveValue(attrValue, component, 'fdObjects')
      };
    }
    return {
      ...memo,
      classList: attr.value.split(' ')
    };
  }

  private processAttributeValue(
    attr: parse5.Attribute,
    memo: any,
    component: Component
  ) {
    const props = memo.props || {};
    props.value = this.processReactiveValue(attr.value, component);
    return {
      ...memo,
      props
    };
  }

  private processAttributeStyle(
    attr: parse5.Attribute,
    memo: any,
    component: Component
  ) {
    const val = attr.value;
    if (!val) {
      return memo;
    }
    return {
      ...memo,
      styles: this.processReactiveValue(val, component, 'fdStyles')
    };
  }

  private processNodeFdFor(
    node: parse5.DefaultTreeElement,
    component: Component
  ): FastDomNode[] {
    const fdForAttrs = node.attrs.reduce(
      (memo, attr) =>
        attr.name === 'fdfor' ||
        attr.name === 'fd-for' ||
        attr.name === 'fdForKey'
          ? {
              ...memo,
              [attr.name]: attr.value
            }
          : memo,
      {}
    );
    const fdForValue = fdForAttrs['fdfor'] || fdForAttrs['fd-for'];
    const reactiveName = this.getReactiveName(fdForValue);

    let arr: any;
    if (reactiveName) {
      if (!(reactiveName in component.reactive)) {
        throw new CompilerErrorReactive(component, 'reactive', reactiveName);
      }
      arr = component.reactive[reactiveName];
    } else {
      try {
        arr = JSON.parse(fdForValue);
      } catch (e) {
        throw new CompilerErrorAttr(component, 'reactive', name);
      }
    }

    return [];
  }
}
