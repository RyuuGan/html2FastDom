import * as domino from 'domino';
import { FastDomNode, Component, Observer, fdObject } from 'faster-dom';
import { CompilerError } from './compilerError';

// TODO: change to parse5
export class HtmlToFastDomCompiler {
  body: HTMLBodyElement;

  constructor(public html: string) {
    const document = domino.createDocument(html);
    this.body = document.querySelector('body');
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

  private _compile(component: Component) {
    if (this.body.childNodes.length > 1) {
      const rootNode = this.processNode(this.body, component);
      rootNode.tag = 'div';
      return rootNode;
    }
    const root = this.body.firstChild;
    if (!root || (root.nodeType !== 1 && root.nodeType !== 3)) {
      return {
        tag: 'textNode',
        textValue: ''
      };
    }
    return this.processNode(root, component);
  }

  processNode(node: ChildNode, component: Component): FastDomNode {
    if (node.nodeType === 3) {
      return {
        tag: 'textNode',
        textValue: this.processReactiveValue(node.textContent, component)
      };
    }
    if (node.nodeType !== 1) {
      return null;
    }
    const el = node as HTMLElement;
    const attrs = this.processAttrs(el, component);
    if (el.childNodes.length === 1 && el.firstChild.nodeType === 3) {
      return {
        tag: el.tagName.toLowerCase(),
        textValue: this.processReactiveValue(
          el.firstChild.textContent,
          component
        ),
        ...attrs
      };
    }
    if (el.childNodes.length === 0) {
      return {
        tag: el.tagName.toLowerCase(),
        ...attrs
      };
    }
    return {
      tag: el.tagName.toLowerCase(),
      ...attrs,
      children: Array.from(el.childNodes).map(child =>
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

  private processAttrs(node: HTMLElement, component: Component): any {
    const data = node.getAttributeNames().reduce(
      (memo, attr) => {
        if (attr === 'value') {
          const props = memo.props || {};
          props.value = this.processReactiveValue(
            node.getAttribute(attr),
            component
          );
          return {
            ...memo,
            props
          };
        }
        if (attr === 'style') {
          const val = node.getAttribute(attr).trim();
          if (!val) {
            return memo;
          }
          return {
            ...memo,
            styles: this.processReactiveValue(val, component, 'fdStyles')
          };
        }
        if (attr === 'class') {
          const attrValue = node.getAttribute(attr);
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
            classList: Array.from(node.classList)
          };
        }
        // TODO: process fdIf and fdFor
        const attrs = memo.attrs || {};
        attrs[attr] = this.processReactiveValue(
          node.getAttribute(attr),
          component
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
}
