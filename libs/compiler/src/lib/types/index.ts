import { FastDomNode } from 'faster-dom';

export type ComponentFactory = (...args: any[]) => FastDomNode

export interface ComponentMap {
  [key: string]: ComponentFactory;
}
