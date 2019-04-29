import { Component, rValue, Observer } from 'revact';

export class TestComponent extends Component {
  rValues = {
    inputValue: new Observer('some value'),
    bgFirstColor: rValue('#' + (((1 << 24) * Math.random()) | 0).toString(16)),
    bgSecondColor: rValue(
      'background-color: #' +
        (((1 << 24) * Math.random()) | 0).toString(16) +
        ';user-select: none;'
    ),
    src: rValue('https://www.w3schools.com/html/pic_trulli.jpg'),
    disabled: rValue(false),
    array: rValue([1, 2]),
    arrayKV: rValue([{ key: 'key1', value: 1 }, { key: 'key2', value: 2 }]),
    object: rValue({
      val: new Observer('some value'),
      disabled: rValue(false),
      arrayKV: rValue([{ key: 'key1', value: 1 }, { key: 'key2', value: 2 }]),
    }),
    divClasses: rValue({
      'some-class': true,
      'some-other-class': false
    }),
    divStyles: rValue({
      display: 'none',
      position: 'absolute'
    })
  };

  keyFn(item: any) {
    return item.key;
  }

  onClick = () => {
    this.rValues.bgFirstColor.value =
      '#' + (((1 << 24) * Math.random()) | 0).toString(16);
  };

  onInput = (e: any) => {
    this.rValues.inputValue.value = e.target.value;
  }

  // tslint:disable
  events = {
    onClick: this.onClick,
    onInput: this.onInit,
  };
  // tslint:enable

}
