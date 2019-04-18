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

        <div fdFor="[8, 9, 10]" letIndex="subIndex" letItem="subItem">
          <span>Parent item</span>
          <span>{{item}}</span>
          <span>Parent index</span>
          <span>{{index}}</span>
          <span>&mdash;</span>
          <span>SubItem</span>
          <span>{{subItem}}</span>
          <span>SubIndex</span>
          <span>{{subIndex}}</span>
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
