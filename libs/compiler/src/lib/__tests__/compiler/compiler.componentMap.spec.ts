import { Component, rValue } from 'revact';
import { HtmlToFastDomCompiler } from '../../compiler';
import { defaultComponentRegistry } from '../../componentMapRegistry';
import { HtmlComponent } from '../../fastDomComponent';
import {
  createArrayItem,
  createArrayItemWithoutTitle
} from '../mocks/arrayItemComponent';
import { createCounter } from '../mocks/simpleCounterComponent';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::componentMap', () => {
  it('should compile component from componentMap without args', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<h1>Simple Counter</h1><simple-counter/>',
      {
        'simple-counter': createCounter
      }
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'h1',
          textValue: 'Simple Counter'
        },
        {
          instance: expect.anything(),
          tag: 'button',
          textValue: rValue(0),
          listeners: {
            click: expect.any(Function)
          }
        }
      ]
    });
  });

  it('should compile component from componentMap with args', () => {
    const compiler = new HtmlToFastDomCompiler(
      `<array-item rFor="{{arrayKV}}" rArgs="['Array item:', item, index]"/>`,
      {
        'array-item': createArrayItem
      }
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 0
            }
          ]
        },
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 2
            },
            {
              tag: 'span',
              textValue: 1
            }
          ]
        }
      ]
    });
  });

  it('should compile component with args with componentMap from decorator', () => {
    @HtmlComponent({
      template: `<array-item rFor="{{arrayKV}}" rArgs="['Array item:', item, index]"/>`
    })
    class TestCmp extends Component {
      reactive = {
        arrayKV: rValue([{ key: 'key1', value: 1 }, { key: 'key2', value: 2 }])
      };
    }

    const component = new TestCmp();

    expect(component.template).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 0
            }
          ]
        },
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 2
            },
            {
              tag: 'span',
              textValue: 1
            }
          ]
        }
      ]
    });
  });

  fit('should compile component with args with componentMap from decorator with provided factory', () => {
    defaultComponentRegistry.remove('array-item');
    defaultComponentRegistry.register(
      'array-item',
      createArrayItemWithoutTitle
    );
    @HtmlComponent({
      template: `<array-item rFor="{{arrayKV}}" rArgs="[item, index]"/>`
    })
    class TestCmpFactory extends Component {
      reactive = {
        arrayKV: rValue([{ key: 'key1', value: 1 }, { key: 'key2', value: 2 }])
      };
    }

    const component = new TestCmpFactory();

    expect(component.template).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 0
            }
          ]
        },
        {
          tag: 'div',
          fdKey: expect.anything(),
          instance: expect.anything(),
          children: [
            {
              tag: 'span',
              textValue: 'Array item:'
            },
            {
              tag: 'span',
              textValue: 2
            },
            {
              tag: 'span',
              textValue: 1
            }
          ]
        }
      ]
    });
  });
});
