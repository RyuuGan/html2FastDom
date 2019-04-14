# Html2FastDom

Simple helper to compile HTML to [FastDom](https://github.com/PxyUp/FastDom/):

# Usage

```
class SimpleForComponent extends Component {

  template: FastDomNode = new HtmlToFastDomCompiler(
    `<div fdFor="[1, 2, 3, 4, 5, 6, 7]">
       <span>Item</span>
       <span>{{item}}</span>
       <span>&mdash;</span>
       <span>index</span>
       <span>{{index}}</span>
     <div>`
  ).compile(this);
}

export function createSimpleFor() {
  return createComponent(SimpleForComponent);
}
```

More examples at [demo project](https://github.com/RyuuGan/html2FastDom/tree/master/apps/demo/src/app/components) in source code.

# Demo

1. Clone the project
2. Install dependencies: `npm i`
3 Run demo: `npm start`