import { Component, Observer } from 'faster-dom';
import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `<button fdOnClick="{{onClick}}">{{counter}}</button>`,
  selector: 'shared-counter'
})
export class CountersShared extends Component {
  onClick = () => {
      this.counter.value += 1;
  }


  onInit() {
      console.log("init CountersShared")
  }

  onDestroy() {
      console.log("destroy CountersShared")
  }

  constructor(private counter: Observer<number>) {
      super()
  }
}

