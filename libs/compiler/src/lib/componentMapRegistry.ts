import { ComponentMap, ComponentFactory } from './types';

export class ComponentMapRegistry {
  public componentMap: ComponentMap = {};

  register(selector: string, componentFactory: ComponentFactory) {
    if (this.isRegistered(selector)) {
      throw new Error(`Component with selector ${selector} already registered`);
    }
    this.componentMap[selector] = componentFactory;
    return this;
  }

  isRegistered(selector: string) {
    return typeof this.componentMap[selector] === 'function';
  }

  remove(selector: string) {
    delete this.componentMap[selector];
  }

  clear() {
    this.componentMap = {};
  }
}

export const defaultComponentRegistry = new ComponentMapRegistry();
