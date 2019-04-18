import { HtmlToFastDomCompiler } from '../../compiler';
import { fdValue } from 'faster-dom';
import { createCounter } from '../mocks/simpleCounterComponent';
import { TestComponent } from '../mocks/testCompoment';
import { createArrayItem } from '../mocks/arrayItemComponent';

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
          textValue: fdValue(0),
          listeners: {
            click: expect.any(Function)
          }
        }
      ]
    });
  });

  it('should compile component from componentMap with args', () => {
    const compiler = new HtmlToFastDomCompiler(
      `<array-item fdFor="{{arrayKV}}" fdArgs="['Array item:', item, index]"/>`,
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
        },
      ]
    });
  });
});
