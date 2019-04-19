import {
  Component,
  FastDomNode,
  createComponent,
  fdObject,
  fdValue
} from 'faster-dom';

import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `
    <div style="{{divFirstStyle}}" fdOnClick="{{onClick}}">Click me(change styles  object)</div>
    <div style="{{divSecondStyle}}" fdOnClick="{{onClickSecond}}">Click me(change css string)</div>
  `,
  selector: 'styles'
})
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
}

export function createStyles() {
  return createComponent(StylesComponent);
}
