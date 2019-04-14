import { createCounter } from './simpleCounter';
import { Component, FastDomNode, createComponent } from 'faster-dom';

import { HtmlToFastDomCompiler } from '@html2FastDom/compiler';

class SimpleForComponent extends Component {

  template: FastDomNode = new HtmlToFastDomCompiler(
    `<div fdFor="[1, 2, 3, 4, 5, 6, 7]">
       <span>Item</span>
       <span>{{item}}</span>
       <span>&mdash;</span>
       <span>index</span>
       <span>{{index}}</span>
     <div>`
  ).compile(this);
}

export function createSimpleFor() {
  return createComponent(SimpleForComponent);
}
