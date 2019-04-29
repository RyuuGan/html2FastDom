import { Component, rValue } from 'revact';
import { HtmlComponent } from './fastDomComponent';
import { defaultComponentRegistry } from './componentMapRegistry';

describe('FastDomComponent', () => {

  beforeEach(() => {
    defaultComponentRegistry.remove('testcomponent');
  });

  it('should compile template with decorator', () => {
    @HtmlComponent({
      template: `<div>{{value}}</div>`
    })
    class TestComponent extends Component {
      reactive = {
        value: rValue('value')
      };
    }

    const component = new TestComponent();

    expect(component.template).toEqual({
      tag: 'div',
      textValue: component.reactive.value
    });
  });

  it('should compile template with decorator accessing parameters', () => {
    @HtmlComponent({
      template: `<div rFor="{{arrayKV}}"><span>{{index}}</span><span>{{item.value}}</span></div>`
    })
    class TestComponent extends Component {
      reactive = {
        arrayKV: rValue([
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' }
        ])
      };
    }

    const component = new TestComponent();

    expect(component.template).toEqual({
      tag: 'div',
      children: [
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 0
            },
            {
              tag: 'span',
              textValue: 'value1'
            }
          ]
        },
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 'value2'
            }
          ]
        }
      ]
    });
  });
});
