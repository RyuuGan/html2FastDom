import 'reflect-metadata';
import { HtmlToFastDomCompiler } from './compiler';
import { FastDomNode, Component, createComponent } from 'faster-dom';
import { CompilerError } from './compilerError';
import {
  ComponentMapRegistry,
  defaultComponentRegistry
} from './componentMapRegistry';
import { ComponentFactory } from './types';

export interface HtmlComponentOptions {
  template: string;
  selector?: string;
  createComponentFactory?: ComponentFactory;
  componentRegistry?: ComponentMapRegistry;
}

export function HtmlComponent(options: HtmlComponentOptions) {
  const registry = options.componentRegistry || defaultComponentRegistry;

  const templateFn = new HtmlToFastDomCompiler(
    options.template,
    registry.componentMap
  ).compile();

  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    const meta = Reflect.getMetadata('design:paramtypes', constructor);
    class HtmlComponentWithConstructor extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const isTypeError = !args.every((item, index) => {
          return (
            Object.getPrototypeOf(item) === Object.getPrototypeOf(meta[index]())
          );
        });
        if (isTypeError) {
          throw new CompilerError(
            this as any,
            'Constructor types are incompatible'
          );
        }
      }
      template: FastDomNode = templateFn(this as any);
    }

    const selector = options.selector || constructor.name.toLowerCase();
    const factory =
      options.createComponentFactory ||
      function(...args: any[]) {
        return createComponent(HtmlComponentWithConstructor as any, ...args);
      };
    registry.register(selector, factory);
    Object.defineProperty(HtmlComponentWithConstructor, 'name', {
      value: constructor.name
    });

    return HtmlComponentWithConstructor;
  };
}
