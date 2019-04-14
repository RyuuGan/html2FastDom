import {
  Component,
  FastDomNode,
  createComponent,
  fdIf,
  fdValue
} from 'faster-dom';

import { HtmlToFastDomCompiler } from '@html2FastDom/compiler';

class DynamicAttr extends Component {

  reactive = {
    src: fdValue('https://www.w3schools.com/html/pic_trulli.jpg'),
    disabled: fdIf(false)
  };

  fdObjects = {
  };

  onClick = () => {
    this.reactive.src.value = 'https://www.w3schools.com/html/img_girl.jpg';
  };

  changeBtnClick = () => {
    this.reactive.disabled.value = !this.reactive.disabled.value;
  };

  btnClick = () => {
    alert('hey');
  };

  template: FastDomNode =  new HtmlToFastDomCompiler(
    `<div>
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
  ).compile(this);
}

export function createExampleAttr() {
  return createComponent(DynamicAttr);
}
