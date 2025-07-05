import { EventEmitter } from 'node:events';
import { FsbEvent } from './types';


type EventType = FsbEvent['type'];

export type Listener<T extends EventType> = (event: FsbEvent & { type: T }) => any;

const emitter = new EventEmitter();

export function on<T extends EventType>(event: T, listener: Listener<T>) {
  emitter.on(event, listener);
}

export function once<T extends EventType>(event: T, listener: Listener<T>) {
  emitter.once(event, listener);
}

export function off<T extends EventType>(event: T, listener: Listener<T>) {
  emitter.off(event, listener);
}

export function emit(event: FsbEvent) {
  emitter.emit(event.type, event);
}
