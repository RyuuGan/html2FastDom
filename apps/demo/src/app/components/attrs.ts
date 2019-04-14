import { Component, createComponent, fdIf, fdValue } from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div>
      <div>
        <span>Current disabled state:</span>
        <span>{{disabled}}</span>
        <button disabled="{{disabled}}" fdOnClick="{{btnClick}}">I am button</button>
        <button fdOnClick="{{changeBtnClick}}">Click me to change</button>
      </div>
      <button fdOnClick="{{onClick}}">Click me</button>
      <span>{{src}}</span>
      <div>
        <img src="{{src}}"/>
      </div>
    </div>`
})
class DynamicAttr extends Component {
  reactive = {
    src: fdValue('https://www.w3schools.com/html/pic_trulli.jpg'),
    disabled: fdIf(false)
  };

  fdObjects = {};

  onClick = () => {
    this.reactive.src.value = 'https://www.w3schools.com/html/img_girl.jpg';
  };

  changeBtnClick = () => {
    this.reactive.disabled.value = !this.reactive.disabled.value;
  };

  btnClick = () => {
    alert('hey');
  };
}

export function createExampleAttr() {
  return createComponent(DynamicAttr);
}
