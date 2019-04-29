import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::rIf', () => {
  it('should compile rIf attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rIf="{{disabled}}">someText</div>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      textValue: 'someText',
      show: comp.rValues.disabled
    });
  });

  it('should compile r-if attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div r-if="{{disabled}}">someText</div>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      textValue: 'someText',
      show: comp.rValues.disabled
    });
  });

  it('should throw if reference in reactive is not defined', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rIf="{{disabled1}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
  });

  it('should throw if reference is not reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rIf="disabled1">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
  });
});
