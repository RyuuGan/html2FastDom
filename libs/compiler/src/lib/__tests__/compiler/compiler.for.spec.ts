import { HtmlToFastDomCompiler } from '../../compiler';
import {
  CompilerErrorReactive,
  CompilerErrorAttr,
  CompilerError
} from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::rFor', () => {
  it('should compile rFor attribute with reference to reactive with no parent', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="{{array}}">someText</div>'
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

  it('should compile rFor attribute with reference to reactive with no parent', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="[1, 2]">someText</div>'
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

  it('should compile rFor attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div rFor="{{array}}">someText</div><div>'
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

  it('should compile rFor attribute with reference to item and index', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="{{array}}"><span>{{item}}</span><span>{{index}}</span></div>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      children: expect.arrayContaining([
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 0
            }
          ]
        },
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 2
            },
            {
              tag: 'span',
              textValue: 1
            }
          ]
        }
      ])
    });
  });

  it('should compile rFor attribute with reference to item and index while renaming', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="{{array}}" letItem="itm" letIndex="idx"><span>{{itm}}</span><span>{{idx}}</span></div>'
    );
    const fastDomNode = compiler.compile(comp);
    expect(fastDomNode).toEqual({
      tag: 'div',
      children: expect.arrayContaining([
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 1
            },
            {
              tag: 'span',
              textValue: 0
            }
          ]
        },
        {
          fdKey: expect.anything(),
          tag: 'div',
          children: [
            {
              tag: 'span',
              textValue: 2
            },
            {
              tag: 'span',
              textValue: 1
            }
          ]
        }
      ])
    });
  });

  it('should compile r-for attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div r-for="{{array}}">someText</div></div>'
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

  it('should compile r-for attribute with static array attribute', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div r-for="[1,2,3]">someText</div><div>'
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

  it('should compile nested rFor', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="[1,2,3]"><div rFor="[4,5]">{{item}}</div></div>'
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

  it('should compile 2 rFor in a row', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="[1,2,3]">{{item}}</div><div rFor="[4,5]">{{item}}</div>'
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

  it('should compile rFor attribute with reference to key function', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="{{arrayKV}}" rForKey="{{keyFn}}">someText</div>'
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
      '<div rFor="{{disabled1}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
  });

  it('should throw if reference in reactive is not defined for rForKey', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="{{array}}" rForKey="{{unknownFN}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerError);
  });

  it('should throw if reference is not reactive and not parsable as array', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div rFor="disabled1">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorAttr);
  });
});
