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
    disabled: fdIf(false),
    array: fdValue([1, 2]),
    arrayKV: fdValue([{ key: 'key1', value: 1 }, { key: 'key2', value: 2 }]),
  };

  fdObjects = {
    divClasses: new fdObject({
      'some-class': true,
      'some-other-class': false
    })
  };

  fdStyles = {
    divStyles: new fdObject({
      display: 'none',
      position: 'absolute'
    })
  };

  keyFn(item: any) {
    return item.key;
  }

  onClick = () => {
    this.reactive.bgFirstColor.value =
      '#' + (((1 << 24) * Math.random()) | 0).toString(16);
  };

  onInput = (e: any) => {
    this.reactive.inputValue.value = e.target.value;
  }

}
