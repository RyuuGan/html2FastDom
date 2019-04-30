import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerError } from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::rOn', () => {
  it('should compile rOnXXX attributes with reference component function', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rOnClick="{{onClick}}">someText</div>'
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

  it('should compile rOnXX multiple attributes with reference component function', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<input rOnClick="{{onClick}}" rOnInput="{{onInput}}"/>'
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

  it('should throw if reference in rValues is not defined', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rOnClick="{{onClick1}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerError);
  });

  it('should throw if reference is not function', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rOnClick="{{rValues}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerError);
  });

  it('should throw if reference is does not exists', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rOnClick="{{UnknownFN}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerError);
  });
});
