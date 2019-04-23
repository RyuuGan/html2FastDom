import { createCounter } from './simpleCounter';
import { Component, FastDomNode, createComponent } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div fdFor="[1, 2, 3, 4, 5, 6, 7]">Item {{item}} &mdash; index {{index}}</div>`,
  selector: 'simple-for'
})
class SimpleForComponent extends Component {}

export function createSimpleFor() {
  return createComponent(SimpleForComponent);
}
