import 'reflect-metadata';
import { HtmlToFastDomCompiler } from './compiler';
import { FastDomNode, Component } from 'faster-dom';
import { CompilerError } from './compilerError';

export interface HtmlComponentOptions {
  template: string;
}

export function HtmlComponent(options: HtmlComponentOptions) {
  const templateFn = new HtmlToFastDomCompiler(options.template).compile();
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    const meta = Reflect.getMetadata('design:paramtypes', constructor);
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const isTypeError = !args.every((item, index) => {
          return (
            Object.getPrototypeOf(item) === Object.getPrototypeOf(meta[index]())
          );
        });
        if (isTypeError) {
          throw new CompilerError(this as any, 'Constructor types are incompatible');
        }
      }
      template: FastDomNode = templateFn(this as any);
    };
  };
}
