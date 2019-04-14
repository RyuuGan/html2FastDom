import { Component, FastDomNode, createComponent, fdValue } from 'faster-dom';

import { HtmlToFastDomCompiler } from '@html2FastDom2/compiler';

class Counter extends Component {
    width = 100;

    reactive = {
        counter: fdValue(0),
    }

    get counter() {
        return this.reactive.counter;
    }

    onClick = () => {
        this.counter.value += 1;
    }

    template: FastDomNode =  new HtmlToFastDomCompiler(
      `<button fdOnClick="{{onClick}}">{{counter}}</button>`
    ).compile(this);
}

export function createCounter() {
  return createComponent(Counter);
}
