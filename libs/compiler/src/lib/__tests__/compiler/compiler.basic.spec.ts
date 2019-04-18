import { HtmlToFastDomCompiler } from '../../compiler';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::Basics', () => {
  describe('Basic compilation', () => {
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
  })

  describe('Compilation with deep assignment', () => {
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
