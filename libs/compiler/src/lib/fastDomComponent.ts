import { HtmlToFastDomCompiler } from './compiler';
import { FastDomNode } from 'faster-dom';

export interface HtmlComponentOptions {
  template: string;
}

export function HtmlComponent(
  options: HtmlComponentOptions
) {
  const templateFn = new HtmlToFastDomCompiler(options.template).compile();
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
      }
      template: FastDomNode = templateFn(this as any);
    };
  };
}
