import { Component, FastDomNode, fdFor, fdObject, Observer } from 'faster-dom';
import * as parse5 from 'parse5';
import { isElementNode, isTextNode } from 'parse5/lib/tree-adapters/default';
import {
  CompilerError,
  CompilerErrorAttr,
  CompilerErrorReactive
} from './compilerError';
import { ComponentMap } from './types';

export class HtmlToFastDomCompiler {
  constructor(public html: string, public componentMap: ComponentMap = {}) {
    this.documentRoot = parse5.parseFragment(html) as any;
  }

  private static fdForAttribs = [
    'fdfor',
    'fd-for',
    'fdforkey',
    'fd-for-key',
    'letindex',
    'letitem'
  ];
  documentRoot: parse5.DefaultTreeDocumentFragment;

  compile(component: Component): FastDomNode;
  compile(): (component: Component) => FastDomNode;
  compile(component?: Component) {
    if (component) {
      return this._compile(component);
    }
    return (cmp: Component) => {
      return this._compile(cmp);
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

  private _compile(component: Component, context: any = component) {
    if (this.documentRoot.childNodes.length > 1) {
      const [rootNode] = this.processNode(
        this.documentRoot,
        component,
        context
      );
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
    if (this.isElementNode(root) && this.isFdFor(root)) {
      const [rootNode] = this.processNode(
        this.documentRoot,
        component,
        context
      );
      rootNode.tag = 'div';
      return rootNode;
    }
    return this.processNode(root, component, context)[0];
  }

  processNode(
    node: parse5.DefaultTreeNode,
    component: Component,
    context: any = {},
    skipArray = false
  ): FastDomNode[] {
    if (this.isTextNode(node)) {
      return [
        {
          tag: 'textNode',
          textValue: this.processReactiveValue(
            node.value,
            component,
            context,
            'reactive'
          )
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
          children: this.processChildren(node, component, context)
        }
      ];
    }
    if (this.isFdFor(node) && !skipArray) {
      return this.processNodeFdFor(node, component, context);
    }
    const tagName = node.tagName.toLowerCase();
    const componentFactory = this.componentMap[tagName];
    if (componentFactory) {
      const args = this.processComponentFactoryArgs(component, node, context);
      return [componentFactory(...args)];
    }
    const attrs = this.processAttrs(node, component, context);
    if (node.childNodes.length === 1 && this.isTextNode(node.childNodes[0])) {
      return [
        {
          tag: tagName,
          textValue: this.processReactiveValue(
            (node.childNodes[0] as parse5.DefaultTreeTextNode).value,
            component,
            context,
            'reactive'
          ),
          ...attrs
        }
      ];
    }
    if (node.childNodes.length === 0) {
      return [
        {
          tag: tagName,
          ...attrs
        }
      ];
    }
    return [
      {
        tag: tagName,
        ...attrs,
        children: this.processChildren(node, component, context)
      }
    ];
  }

  private processChildren(
    node: parse5.DefaultTreeElement | parse5.DefaultTreeDocumentFragment,
    component: Component,
    context: any
  ) {
    return Array.from(node.childNodes)
      .map(child => this.processNode(child, component, context))
      .reduce((memo, arr) => memo.concat(arr));
  }

  private getReactiveName(input: string): string | null {
    const groups = input.match(/^\{\{\s*(.*)\s*\}\}$/);
    return groups && groups[1];
  }

  private processReactiveValue(
    input: string,
    component: Component,
    context: any,
    reactiveType: 'reactive'
  ): string | Observer<any>;
  private processReactiveValue(
    input: string,
    component: Component,
    context: any,
    reactiveType: 'fdStyles'
  ): fdObject<any> | Observer<string>;
  private processReactiveValue(
    input: string,
    component: Component,
    context: any,
    reactiveType: 'fdObjects'
  ): fdObject<any>;
  private processReactiveValue(
    input: string,
    component: Component,
    context: any = {},
    reactiveType: 'reactive' | 'fdObjects' | 'fdStyles'
  ) {
    const name = this.getReactiveName(input);
    if (name) {
      return this.getValue(name, component, reactiveType, context);
    }
    return input;
  }

  private getValue(
    name: string,
    component: Component,
    reactiveType: string,
    context: any
  ) {
    try {
      const contextValue = this.getValueDeep(component, context, name);
      if (typeof contextValue !== undefined) {
        return contextValue;
      }
    } catch {}
    try {
      return this.getValueDeep(component, component[reactiveType], name);
    } catch {
      throw new CompilerErrorReactive(component, reactiveType, name);
    }
  }

  private getValueDeep(component: Component, context: any, name: string) {
    const names = name.split('.');
    let current = context;
    for (let i = 0; i < names.length; i++) {
      if (!names[i]) {
        throw new CompilerError(component, `Invalid name ${name} to lookup.`);
      }

      if (current === null || current === undefined || !(names[i] in current)) {
        throw new CompilerError(
          component,
          `Invalid reference for ${name} to lookup. Cannot read ${
            names[i]
          } of ${current}`
        );
      }
      current = current[names[i]];
    }
    return current;
  }

  private processAttrs(
    node: parse5.DefaultTreeElement,
    component: Component,
    context: any
  ): any {
    const data = node.attrs.reduce(
      (memo, attr) => {
        if (attr.name.startsWith('fdfor') || attr.name.startsWith('fd-for')) {
          return memo;
        }
        if (attr.name.startsWith('let')) {
          return memo;
        }
        if (attr.name === 'value') {
          return this.processAttributeValue(attr, memo, component, context);
        }
        if (attr.name === 'style') {
          return this.processAttributeStyle(attr, memo, component, context);
        }
        if (attr.name === 'class') {
          return this.processAttributeClass(attr, memo, component, context);
        }
        // fdIf
        if (attr.name === 'fdif' || attr.name === 'fd-if') {
          return this.processAttributeFdIf(attr, memo, component, context);
        }
        if (attr.name.startsWith('fdon')) {
          return this.processAddributeFdOn(attr, memo, component, context);
        }
        const attrs = memo.attrs || {};
        attrs[attr.name] = this.processReactiveValue(
          attr.value,
          component,
          context,
          'reactive'
        );
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
    component: Component,
    context: any
  ) {
    const name = this.getReactiveName(attr.value);
    if (!name) {
      throw new CompilerErrorReactive(component, 'reactive', attr.name);
    }
    const show = this.getValue(name, component, 'reactive', context);
    return {
      ...memo,
      show
    };
  }

  private processAttributeClass(
    attr: parse5.Attribute,
    memo: any,
    component: Component,
    context: any
  ) {
    const attrValue = attr.value;
    const reactiveName = this.getReactiveName(attrValue);

    if (reactiveName) {
      return {
        ...memo,
        classList: this.processReactiveValue(
          attrValue,
          component,
          context,
          'fdObjects'
        )
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
    component: Component,
    context: any
  ) {
    const props = memo.props || {};
    props.value = this.processReactiveValue(
      attr.value,
      component,
      context,
      'reactive'
    );
    return {
      ...memo,
      props
    };
  }

  private processAddributeFdOn(
    attr: parse5.Attribute,
    memo: any,
    component: Component,
    context: any
  ) {
    const eventName = attr.name.substring(4); // 'fdon'.length
    const listeners = memo.listeners || {};
    const name = this.getReactiveName(attr.value);

    if (!name) {
      throw new CompilerError(
        component,
        `fdOn must be a function, got ${
          component.constructor.name
        }[${name}] = ${component[name]}`
      );
    }
    let eventFn: any;
    try {
      eventFn = this.getValueDeep(component, context, name);
    } catch {
      eventFn = this.getValueDeep(component, component, name);
    }

    if (typeof eventFn !== 'function') {
      throw new CompilerError(
        component,
        `fdOn must be a function, got ${
          component.constructor.name
        }[${name}] = ${component[name]}`
      );
    }
    listeners[eventName] = eventFn;
    memo.listeners = listeners;
    return memo;
  }

  private processAttributeStyle(
    attr: parse5.Attribute,
    memo: any,
    component: Component,
    context: any
  ) {
    const val = attr.value;
    if (!val) {
      return memo;
    }
    return {
      ...memo,
      styles: this.processReactiveValue(val, component, context, 'fdStyles')
    };
  }

  private processNodeFdFor(
    node: parse5.DefaultTreeElement,
    component: Component,
    context: any
  ): FastDomNode[] {
    const fdForAttrs = node.attrs.reduce(
      (memo, attr) =>
        HtmlToFastDomCompiler.fdForAttribs.includes(attr.name)
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
      try {
        arr = this.getValue(reactiveName, component, 'reactive', context);
      } catch {
        throw new CompilerErrorReactive(component, 'reactive', reactiveName);
      }
    } else {
      try {
        arr = JSON.parse(fdForValue);
        if (!Array.isArray(arr)) {
          throw new Error('Not Array');
        }
      } catch {
        throw new CompilerErrorAttr(component, 'fdFor', 'must be an array');
      }
    }

    let keyFn: (item: any) => any;
    const fdForKeyValue = fdForAttrs['fdforkey'] || fdForAttrs['fd-for-key'];

    if (fdForKeyValue) {
      const name = this.getReactiveName(fdForKeyValue);
      if (!name) {
        throw new CompilerError(
          component,
          `fdKeyFor must be a function, got ${
            component.constructor.name
          }[${name}] = ${name}`
        );
      }
      keyFn = this.getValueDeep(component, component, name);

      if (typeof keyFn !== 'function') {
        throw new CompilerError(
          component,
          `fdOn must be a function, got ${
            component.constructor.name
          }[${name}] = ${component[name]}`
        );
      }
    }
    const indexName = fdForAttrs['letindex'] || 'index';
    const itemName = fdForAttrs['letitem'] || 'item';
    // TODO: add fdFor overrides for variables name
    // TODO: add inputs args, currently not supported
    return fdFor(
      arr,
      (item, index) => {
        const nodes = this.processNode(
          node,
          component,
          {
            ...context,
            [itemName]: item,
            [indexName]: index
          },
          true
        );
        return nodes[0];
      },
      [(e: any) => e],
      keyFn
    );
  }

  private processComponentFactoryArgs(
    component: Component,
    node: parse5.DefaultTreeElement,
    context: any
  ): any[] {
    const fdArgs = node.attrs.find(a => a.name === 'fdargs');
    if (!fdArgs) {
      return [];
    }
    const arr = fdArgs.value.trim();
    if (arr[0] !== '[' || arr[arr.length - 1] !== ']') {
      throw new CompilerErrorAttr(component, 'fdArgs', 'must be an array');
    }
    const args = arr
      .substring(1, arr.length - 1)
      .split(',')
      .map(value => {
        const e = value.trim();
        if (/^[a-zA-Z_][a-zA-Z_\.-]*$/.test(e)) {
          return this.getValueDeep(component, context, e);
        } else {
          try {
            // with autoreplace for strings
            return JSON.parse(e.replace(/'/g, '"'));
          } catch {
            throw new CompilerErrorAttr(
              component,
              'fdArgs',
              `is invalid: can not parse ${e} as primitive value`
            );
          }
        }
      });
    return args;
  }
}
