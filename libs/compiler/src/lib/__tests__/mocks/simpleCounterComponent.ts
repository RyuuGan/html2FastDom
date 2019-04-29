import { Component, createComponent, rValue } from 'revact';

import { HtmlComponent } from '../../fastDomComponent';

@HtmlComponent({
  template: `<button rOnClick="{{onClick}}">{{counter}}</button>`
})
class Counter extends Component {
    width = 100;

    reactive = {
        counter: rValue(0),
    }

    onClick = () => {
        this.reactive.counter.value += 1;
    }
}

export function createCounter() {
  return createComponent(Counter);
}
