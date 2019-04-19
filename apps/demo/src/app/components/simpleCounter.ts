import { Component, FastDomNode, createComponent, fdValue } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `<button fdOnClick="{{onClick}}">{{counter}}</button>`,
  selector: 'counter'
})
class Counter extends Component {
  width = 100;

  reactive = {
    counter: fdValue(0)
  };

  get counter() {
    return this.reactive.counter;
  }

  onClick = () => {
    this.counter.value += 1;
  };
}

export function createCounter() {
  return createComponent(Counter);
}
