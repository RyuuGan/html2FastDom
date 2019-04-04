import { Component, fdValue, fdIf, fdObject, Observer } from 'faster-dom';

export class TestComponent extends Component {
  reactive = {
    inputValue: new Observer('some value'),
    bgFirstColor: fdValue('#' + (((1 << 24) * Math.random()) | 0).toString(16)),
    bgSecondColor: fdValue(
      'background-color: #' +
        (((1 << 24) * Math.random()) | 0).toString(16) +
        ';user-select: none;'
    ),
    src: fdValue('https://www.w3schools.com/html/pic_trulli.jpg'),
    disabled: fdIf(false)
  };

  fdObjects = {
    divClasses: new fdObject({
      'some-class': true,
      'some-other-class': false
    }),
  };

  fdStyles = {
    divStyles: new fdObject({
      display: 'none',
      position: 'absolute'
    })
  };

  changeBtnClick = () => {
    this.reactive.disabled.value = !this.reactive.disabled.value;
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
