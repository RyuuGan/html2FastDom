import { fdObject } from 'faster-dom';
import { HtmlToFastDomCompiler } from './compiler';
import { CompilerErrorReactive } from './compilerError';
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
});
