import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerError, CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::fdOn', () => {
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
