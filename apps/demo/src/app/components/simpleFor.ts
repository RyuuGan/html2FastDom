import { createCounter } from './simpleCounter';
import { Component, FastDomNode, createComponent } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div fdFor="[1, 2, 3, 4, 5, 6, 7]">
      <span>Item</span>
      <span>{{item}}</span>
      <span>&mdash;</span>
      <span>index</span>
      <span>{{index}}</span>
    </div>`
})
class SimpleForComponent extends Component {}

export function createSimpleFor() {
  return createComponent(SimpleForComponent);
}
