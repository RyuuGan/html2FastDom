import { fdObject } from 'faster-dom';
import { HtmlToFastDomCompiler } from '../../compiler';
import {
  CompilerErrorReactive,
  CompilerErrorAttr,
  CompilerError
} from '../../compilerError';
import { TestComponent } from '../mocks/testCompoment';

const comp = new TestComponent();

describe('Compiler::fdFor', () => {
  it('should compile fdFor attribute with reference to reactive with no parent', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="{{array}}">someText</div>'
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

  it('should compile fdFor attribute with reference to reactive with no parent', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="[1, 2]">someText</div>'
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

  it('should compile fdFor attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div fdFor="{{array}}">someText</div><div>'
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

  it('should compile fdFor attribute with reference to item and index', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="{{array}}"><span>{{item}}</span><span>{{index}}</span></div>'
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

  it('should compile fdFor attribute with reference to item and index while renaming', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="{{array}}" letItem="itm" letIndex="idx"><span>{{itm}}</span><span>{{idx}}</span></div>'
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

  it('should compile fd-for attribute with reference to reactive', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div fd-for="{{array}}">someText</div></div>'
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

  it('should compile fd-for attribute with static array attribute', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div><div fd-for="[1,2,3]">someText</div><div>'
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

  it('should compile nested fdFor', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="[1,2,3]"><div fdFor="[4,5]">{{item}}</div></div>'
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

  it('should compile 2 fdFor in a row', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="[1,2,3]">{{item}}</div><div fdFor="[4,5]">{{item}}</div>'
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

  it('should compile fdFor attribute with reference to key function', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="{{arrayKV}}" fdForKey="{{keyFn}}">someText</div>'
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
      '<div fdFor="{{disabled1}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorReactive);
  });

  it('should throw if reference in reactive is not defined for fdForKey', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="{{array}}" fdForKey="{{unknownFN}}">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerError);
  });

  it('should throw if reference is not reactive and not parsable as array', () => {
    const compiler = new HtmlToFastDomCompiler(
      '<div fdFor="disabled1">someText</div>'
    );
    expect(() => compiler.compile(comp)).toThrow(CompilerErrorAttr);
  });
});
