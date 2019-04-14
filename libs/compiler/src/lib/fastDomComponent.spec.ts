import { Component, fdValue } from 'faster-dom';
import { HtmlComponent } from './fastDomComponent';

describe('FastDomComponent', () => {
  it('should compile template with decorator', () => {
    @HtmlComponent({
      template: `<div>{{value}}</div>`
    })
    class TestComponent extends Component {
      reactive = {
        value: fdValue('value')
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
      template: `<div fdFor="{{arrayKV}}"><span>{{index}}</span><span>{{item.value}}</span></div>`
    })
    class TestComponent extends Component {
      reactive = {
        arrayKV: fdValue([
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
