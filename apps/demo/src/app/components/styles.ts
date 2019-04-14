import {
  Component,
  FastDomNode,
  createComponent,
  fdObject,
  fdValue
} from 'faster-dom';

import { HtmlToFastDomCompiler } from '@html2FastDom/compiler';

// tslint:disable:no-bitwise
class StylesComponent extends Component {
  reactive = {
    bgFirstColor: fdValue('#' + (((1 << 24) * Math.random()) | 0).toString(16)),
    bgSecondColor: fdValue(
      'background-color: #' +
        (((1 << 24) * Math.random()) | 0).toString(16) +
        ';user-select: none;'
    )
  };

  fdStyles = {
    divFirstStyle: new fdObject({
      'background-color': this.reactive.bgFirstColor,
      'user-select': 'none'
    }),
    divSecondStyle: this.reactive.bgSecondColor
  };

  onClick = () => {
    this.reactive.bgFirstColor.value =
      '#' + (((1 << 24) * Math.random()) | 0).toString(16);
  };

  onClickSecond = () => {
    this.reactive.bgSecondColor.value =
      'background-color: #' +
      (((1 << 24) * Math.random()) | 0).toString(16) +
      ';user-select: none;';
  };

  template: FastDomNode = new HtmlToFastDomCompiler(
    `
      <div style="{{divFirstStyle}}" fdOnClick={{onClick}}>Click me(change styles  object)</div>
      <div style="{{divSecondStyle}}" fdOnClick={{onClickSecond}}>Click me(change css string)</div>
    `
  ).compile(this);
}

export function createStyles() {
  return createComponent(StylesComponent);
}
