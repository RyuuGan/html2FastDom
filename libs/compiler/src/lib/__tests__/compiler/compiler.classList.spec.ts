import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::classList', () => {
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
