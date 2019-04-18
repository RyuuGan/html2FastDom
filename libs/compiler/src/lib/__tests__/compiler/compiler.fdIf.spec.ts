import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::fdIf', () => {
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
