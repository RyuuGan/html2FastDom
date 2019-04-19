import { HtmlComponent } from '@html2FastDom/compiler';
import { Component, createComponent, fdValue } from 'faster-dom';

@HtmlComponent({
  template: `<shared-counter fdFor="[1, 2, 3, 4, 5, 6, 7]" fdArgs="[sharedValue]"/>`,
  selector: 'counter-shared-for'
})
class CounterForComponent extends Component {
  reactive = {
    sharedValue: fdValue(0)
  };
}

export function createCounterSharedFor() {
  return createComponent(CounterForComponent);
}
