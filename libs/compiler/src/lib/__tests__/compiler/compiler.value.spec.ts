import { rValue } from 'revact';
import { HtmlToFastDomCompiler } from '../../compiler';
import { CompilerErrorReactive } from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::value', () => {
  it('should compile value attribute hardcoded', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<input value="hello world"/>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'input',
      props: rValue({
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
          props: rValue({
            value: 'hello world'
          })
        },
        {
          tag: 'input',
          props: rValue({
            value: 'another hello world'
          })
        }
      ]
    });
  });

  it('should compile value attribute with reference to rValues', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<input value="{{inputValue}}"/>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'input',
      props: rValue({
        value: comp.rValues.inputValue
      })
    });
  });

  it('should throw if style attribute has no reference to rValues', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<input value="{{inputValue1}}"/>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
  });
});
