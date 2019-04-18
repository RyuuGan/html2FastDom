import { Component, createComponent, fdFor } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div>
      <div fdFor="[1, 2, 3, 4, 5, 6, 7]">
        <span>Item</span>
        <span>{{item}}</span>
        <span>&mdash;</span>
        <span>index</span>
        <span>{{index}}</span>

        <div fdFor="[8, 9, 10]">
          <span>SubItem</span>
          <span>{{item}}</span>
        </div>
      </div>
    </div>
    `
})
class NestedForComponent extends Component {
}

export function createNestedFor() {
  return createComponent(NestedForComponent);
}
