# Html2FastDom

Simple helper to compile HTML to [FastDom](https://github.com/PxyUp/FastDom/):

# Usage

Just import `HtmlComponent` decorator and use it with your class:

```ts
import { HtmlComponent } from '@html2FastDom/compiler';

@HtmlComponent({
  template: `<button rOnClick="{{onClick}}">{{counter}}</button>`,
  selector: 'counter'
})
class Counter extends Component {
  width = 100;

  reactive = {
    counter: rValue(0)
  };

  get counter() {
    return this.reactive.counter;
  }

  onClick = () => {
    this.counter.value += 1;
  };
}

export function createCounter() {
  return createComponent(Counter);
}

bootstrap('#counter', createCounter);
```

`HtmlComponent` uses `componentMap` under the hood so every component described
with this decorator is automatically registered in the component map.
After defining the component via decorator you can access it via selector or by
class name if selector is not specified:

```ts
@HtmlComponent({
  template: `<counter rFor="[1, 2, 3, 4, 5, 6, 7]"/>`,
  selector: 'counter-for'
})
class CounterForComponent extends Component {}

export function createCounterFor() {
  return createComponent(CounterForComponent);
}

bootstrap('#counter_for', createCounterFor);
```

The code above creates 7 separate counters.

# Component Map

To add your component to default `componentMap` use `register` function at `defaultComponentRegistry`:

```ts
import { defaultComponentRegistry } from '@html2FastDom/compiler';

defaultComponentRegistry.register('my-counter', createCounter);
```

If you want some components not to be visible via `HtmlComponent` use
`componentRegistry` property when creating your component, so the component
will be registered in the given componentRegistry:

```ts
import { ComponentMapRegistry } from '@html2FastDom/compiler';

const myRegistry = new ComponentMapRegistry();

@HtmlComponent({
  template: `<div rFor="[1, 2, 3, 4, 5, 6, 7]">{{item}}</div>`,
  selector: 'counter-for',
  componentRegistry: myRegistry
})
class CounterForComponent extends Component {}
```


# Advanced Usage (via compiler)

```ts
import { HtmlToFastDomCompiler } from '@html2FastDom/compiler';

const someComponentFactory = (index) => createComponent(SomeComponent, index)

const componentMap = {
  'some-component': someComponentFactory
}

class SimpleForComponent extends Component {

  template: FastDomNode = new HtmlToFastDomCompiler(
    `<div rFor="[1, 2, 3, 4, 5, 6, 7]">
       <span>Item</span>
       <span>{{item}}</span>
       <span>&mdash;</span>
       <span>index</span>
       <span>{{index}}</span>
       <some-component rArgs="[item]"/>
     <div>`
  ).compile(this, componentMap);
}

export function createSimpleFor() {
  return createComponent(SimpleForComponent);
}
```

More examples at [demo project](https://github.com/RyuuGan/html2FastDom/tree/master/apps/demo/src/app/components) in source code.

# Demo

1. Clone the project
2. Install dependencies: `npm i`
3. Run demo: `npm start`