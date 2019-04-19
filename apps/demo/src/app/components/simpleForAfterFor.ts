import { Component, createComponent } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div fdFor="[1, 2, 3]">
      <span>Item</span>
      <span>{{item}}</span>
      <span>&mdash;</span>
      <span>index</span>
      <span>{{index}}</span>
    </div>
    <div fdFor="[5, 6, 7]" letIndex="idx" letItem="itm">
      <span>Item</span>
      <span>{{itm}}</span>
      <span>&mdash;</span>
      <span>index</span>
      <span>{{idx}}</span>
    </div>`,
  selector: 'simple-for-after-for'
})
class SimpleForAfterForComponent extends Component {}

export function createSimpleForAfterFor() {
  return createComponent(SimpleForAfterForComponent);
}
