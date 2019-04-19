import { createCounter } from './simpleCounter';
import { Component, FastDomNode, createComponent } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `<counter fdFor="[1, 2, 3, 4, 5, 6, 7]"/>`,
  selector: 'counter-for'
})
class CounterForComponent extends Component {}

export function createCounterFor() {
  return createComponent(CounterForComponent);
}
