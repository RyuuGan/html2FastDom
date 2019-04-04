import { Component, FastDomNode, fdObject, Observer } from 'faster-dom';
import * as parse5 from 'parse5';
import { isElementNode, isTextNode } from 'parse5/lib/tree-adapters/default';
import { CompilerError } from './compilerError';

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

  private _compile(component: Component) {
    if (this.documentRoot.childNodes.length > 1) {
      const rootNode = this.processNode(this.documentRoot, component);
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
    return this.processNode(root, component);
  }

  processNode(node: parse5.DefaultTreeNode, component: Component): FastDomNode {
    if (this.isTextNode(node)) {
      return {
        tag: 'textNode',
        textValue: this.processReactiveValue(node.value, component)
      };
    }
    if (!this.isElementNode(node) && !this.isDocumentFragment(node)) {
      return null;
    }
    if (this.isDocumentFragment(node)) {
      return {
        tag: null,
        children: Array.from(node.childNodes).map(child =>
          this.processNode(child, component)
        )
      };
    }
    const attrs = this.processAttrs(node, component);
    if (node.childNodes.length === 1 && this.isTextNode(node.childNodes[0])) {
      return {
        tag: node.tagName.toLowerCase(),
        textValue: this.processReactiveValue(
          (node.childNodes[0] as parse5.DefaultTreeTextNode).value,
          component
        ),
        ...attrs
      };
    }
    if (node.childNodes.length === 0) {
      return {
        tag: node.tagName.toLowerCase(),
        ...attrs
      };
    }
    return {
      tag: node.tagName.toLowerCase(),
      ...attrs,
      children: Array.from(node.childNodes).map(child =>
        this.processNode(child, component)
      )
    };
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
        throw new CompilerError(component, reactiveType, name);
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
        if (attr.name === 'value') {
          const props = memo.props || {};
          props.value = this.processReactiveValue(attr.value, component);
          return {
            ...memo,
            props
          };
        }
        if (attr.name === 'style') {
          const val = attr.value;
          if (!val) {
            return memo;
          }
          return {
            ...memo,
            styles: this.processReactiveValue(val, component, 'fdStyles')
          };
        }
        if (attr.name === 'class') {
          const attrValue = attr.value;
          const reactiveName = this.getReactiveName(attrValue);

          if (reactiveName) {
            return {
              ...memo,
              classList: this.processReactiveValue(
                attrValue,
                component,
                'fdObjects'
              )
            };
          }
          return {
            ...memo,
            classList: attr.value.split(' ')
          };
        }
        // TODO: process fdIf and fdFor
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
}
