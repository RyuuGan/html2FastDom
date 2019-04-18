import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::style', () => {
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
