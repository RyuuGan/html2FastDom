import { Component, createComponent, fdValue } from 'faster-dom';

import { HtmlComponent } from '../../fastDomComponent';

@HtmlComponent({
  template: `<button fdOnClick="{{onClick}}">{{counter}}</button>`
})
class Counter extends Component {
    width = 100;

    reactive = {
        counter: fdValue(0),
    }

    onClick = () => {
        this.reactive.counter.value += 1;
    }
}

export function createCounter() {
  return createComponent(Counter);
}
