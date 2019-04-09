import { Component } from 'faster-dom';

export class CompilerError extends Error {
  constructor(public msg: string) {
    // 'Error' breaks prototype chain here
    super(msg);

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
  }
}

export class CompilerErrorReactive extends CompilerError {
  constructor(
    public component: Component,
    public reactiveField: string,
    public reactiveName: string
  ) {
    // 'Error' breaks prototype chain here
    super(
      `${
        component.constructor.name
      }.${reactiveField}.${reactiveName} is not defined.`
    );
  }
}

export class CompilerErrorAttr extends CompilerError {
  constructor(
    public component: Component,
    public attr: string,
    public msg: string
  ) {
    // 'Error' breaks prototype chain here
    super(`Attribute ${attr} at ${component.constructor.name} must be ${msg}.`);
  }
}
