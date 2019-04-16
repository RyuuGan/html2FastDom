import { fdObject } from 'faster-dom';
import { HtmlToFastDomCompiler } from './compiler';
import {
  CompilerErrorReactive,
  CompilerErrorAttr,
  CompilerError
} from './compilerError';
import { TestComponent } from './mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler', () => {
  it('should compile simple text node', () => {
    const compiler = new HtmlToFastDomCompiler('someText');
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({ tag: 'textNode', textValue: 'someText' });
  });

  it('should compile simple tag node', () => {
    const compiler = new HtmlToFastDomCompiler('<div>someText</div>');
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({ tag: 'div', textValue: 'someText' });
  });

  it('should compile double tag as a root', () => {
    const compiler = new HtmlToFastDomCompiler('<div>someText</div>someText');
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      children: [
        { tag: 'div', textValue: 'someText' },
        { tag: 'textNode', textValue: 'someText' }
      ]
    });
  });

  describe('value', () => {
    it('should compile value attribute hardcoded', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<input value="hello world"/>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'input',
        props: new fdObject({
          value: 'hello world'
        })
      });
    });

    it('should compile value attribute for all nodes', () => {
      const compiler = new HtmlToFastDomCompiler(
        `<div><input value="hello world"/><input value="another hello world"/></div>`
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: [
          {
            tag: 'input',
            props: new fdObject({
              value: 'hello world'
            })
          },
          {
            tag: 'input',
            props: new fdObject({
              value: 'another hello world'
            })
          }
        ]
      });
    });

    it('should compile value attribute with reference to fdObjects', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<input value="{{inputValue}}"/>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'input',
        props: new fdObject({
          value: comp.reactive.inputValue
        })
      });
    });

    it('should throw if style attribute has no reference to fdObjects', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<input value="{{inputValue1}}"/>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });
  });

  describe('style', () => {
    it('should compile style attributes hardcoded', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div style="hello world">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        styles: 'hello world'
      });
    });

    it('should compile style attributes for all nodes', () => {
      const compiler = new HtmlToFastDomCompiler(
        `<div style="hello world"><span>someText</span><span style="some classes for span">Span Classes</span></div>`
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        styles: 'hello world',
        children: [
          { tag: 'span', textValue: 'someText' },
          {
            tag: 'span',
            textValue: 'Span Classes',
            styles: 'some classes for span'
          }
        ]
      });
    });

    it('should compile style attribute with reference to fdStyles', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div style="{{divStyles}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        styles: comp.fdStyles.divStyles
      });
    });

    it('should throw if style attribute has no reference to fdStyles', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div style="{{divStyles1}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });
  });

  describe('classList', () => {
    it('should compile class attributes hardcoded', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div class="hello world">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        classList: ['hello', 'world']
      });
    });

    it('should compile class attributes for all nodes', () => {
      const compiler = new HtmlToFastDomCompiler(
        `<div class="hello world"><span>someText</span><span class="some classes for span">Span Classes</span></div>`
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        classList: ['hello', 'world'],
        children: [
          { tag: 'span', textValue: 'someText' },
          {
            tag: 'span',
            textValue: 'Span Classes',
            classList: ['some', 'classes', 'for', 'span']
          }
        ]
      });
    });

    it('should compile class attributes with reference to fdObjects', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div class="{{divClasses}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        classList: comp.fdObjects.divClasses
      });
    });

    it('should throw if reference in fdObjects is not defined', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div class="{{divClasses1}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });
  });

  describe('fdIf', () => {
    it('should compile fdIf attribute with reference to reactive', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdIf="{{disabled}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        show: comp.reactive.disabled
      });
    });

    it('should compile fd-if attribute with reference to reactive', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fd-if="{{disabled}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        show: comp.reactive.disabled
      });
    });

    it('should throw if reference in reactive is not defined', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdIf="{{disabled1}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });

    it('should throw if reference is not reactive', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdIf="disabled1">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });
  });

  describe('fdOn', () => {
    it('should compile fdOnXXX attributes with reference component function', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdOnClick="{{onClick}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: 'someText',
        listeners: {
          click: comp.onClick
        }
      });
    });

    it('should compile fdOnXX multiple attributes with reference component function', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<input fdOnClick="{{onClick}}" fdOnInput="{{onInput}}"/>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'input',
        listeners: {
          click: comp.onClick,
          input: comp.onInput
        }
      });
    });

    it('should throw if reference in reactive is not defined', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdIf="{{disabled1}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });

    it('should throw if reference is not function', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdOnClick="{{reactive}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerError);
    });

    it('should throw if reference is does not exists', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdOnClick="{{UnknownFN}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerError);
    });
  });

  describe('fdFor', () => {
    it('should compile fdFor attribute with reference to reactive with no parent', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="{{array}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should compile fdFor attribute with reference to reactive with no parent', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="[1, 2]">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should compile fdFor attribute with reference to reactive', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div><div fdFor="{{array}}">someText</div><div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should compile fd-for attribute with reference to reactive', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div><div fd-for="{{array}}">someText</div></div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should compile fd-for attribute with static array attribute', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div><div fd-for="[1,2,3]">someText</div><div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should compile nested fdFor', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="[1,2,3]"><div fdFor="[4,5]">{{item}}</div></div>'
      );
      const fastDomNode = compiler.compile(comp);

      expect(fastDomNode.children.length).toEqual(3);
      expect(fastDomNode.children[0]).toEqual({
        fdKey: expect.anything(),
        tag: 'div',
        children: [
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 4
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 5
          }
        ]
      });
      expect(fastDomNode.children[1]).toEqual({
        fdKey: expect.anything(),
        tag: 'div',
        children: [
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 4
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 5
          }
        ]
      });
      expect(fastDomNode.children[2]).toEqual({
        fdKey: expect.anything(),
        tag: 'div',
        children: [
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 4
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 5
          }
        ]
      });
    });

    it('should compile 2 fdFor in a row', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="[1,2,3]">{{item}}</div><div fdFor="[4,5]">{{item}}</div>'
      );
      const fastDomNode = compiler.compile(comp);

      expect(fastDomNode.children.length).toEqual(5);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: [
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 1
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 2
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 3
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 4
          },
          {
            fdKey: expect.anything(),
            tag: 'div',
            textValue: 5
          }
        ]
      });
    });

    it('should compile fdFor attribute with reference to key function', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="{{arrayKV}}" fdForKey="{{keyFn}}">someText</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: 'key1',
            tag: 'div',
            textValue: 'someText'
          },
          {
            fdKey: 'key2',
            tag: 'div',
            textValue: 'someText'
          }
        ])
      });
    });

    it('should throw if reference in reactive is not defined', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="{{disabled1}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
    });

    it('should throw if reference in reactive is not defined for fdForKey', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="{{array}}" fdForKey="{{unknownFN}}">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerError);
    });

    it('should throw if reference is not reactive and not parsable as array', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="disabled1">someText</div>'
      );
      expect(() => compiler.compile(comp)).toThrow(CompilerErrorAttr);
    });
  });

  describe('Deep Assignment', () => {
    it('should compile simple with deep assignment', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div>{{object.value.val}}</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        textValue: comp.reactive.object.value.val
      });
    });

    it('should compile fdOnXX multiple attributes with reference component function', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<input fdOnClick="{{events.onClick}}" fdOnInput="{{events.onInput}}"/>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'input',
        listeners: {
          click: comp.events.onClick,
          input: comp.events.onInput
        }
      });
    });

    it('should compile fdFor attribute with reference to key function and get item from context', () => {
      const compiler = new HtmlToFastDomCompiler(
        '<div fdFor="{{arrayKV}}" fdForKey="{{keyFn}}">{{item.value}}</div>'
      );
      const fastDomNode = compiler.compile(comp);
      expect(fastDomNode).toEqual({
        tag: 'div',
        children: expect.arrayContaining([
          {
            fdKey: 'key1',
            tag: 'div',
            textValue: 1
          },
          {
            fdKey: 'key2',
            tag: 'div',
            textValue: 2
          }
        ])
      });
    });
  });
});
