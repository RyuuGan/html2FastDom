import { Component } from 'revact';

export class CompilerError extends Error {
  constructor(public component: Component, public msg: string) {
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
    public reactiveName: string
  ) {
    // 'Error' breaks prototype chain here
    super(
      component,
      `${
        component.constructor.name
      }.rValues.${reactiveName} is not defined.`
    );

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
  }
}

export class CompilerErrorAttr extends CompilerError {
  constructor(
    public component: Component,
    public attr: string,
    public msg: string
  ) {
    // 'Error' breaks prototype chain here
    super(
      component,
      `Attribute ${attr} at ${component.constructor.name} ${msg}.`
    );

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
  }
}
