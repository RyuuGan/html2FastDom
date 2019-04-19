import { Component, createComponent, fdValue } from 'faster-dom';

import { HtmlComponent } from '../../fastDomComponent';

@HtmlComponent({
  template: `<div><span>{{title}}</span><span>{{item.value}}</span><span>{{index}}</span></div>`,
  selector: 'array-item'
})
class ArrayItemComponent extends Component {

  constructor(private title: string, private item: any, private index: number) {
    super();
  }
}

export function createArrayItem(title: string, item: any, index: number) {
  return createComponent(ArrayItemComponent, title, item, index);
}

export function createArrayItemWithoutTitle(item: any, index: number) {
  return createComponent(ArrayItemComponent, 'Array item:', item, index);
}
