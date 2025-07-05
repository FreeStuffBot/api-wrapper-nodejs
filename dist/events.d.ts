import { FsbEvent } from './types';
type EventType = FsbEvent['type'];
export type Listener<T extends EventType> = (event: FsbEvent & {
    type: T;
}) => any;
export declare function on<T extends EventType>(event: T, listener: Listener<T>): void;
export declare function once<T extends EventType>(event: T, listener: Listener<T>): void;
export declare function off<T extends EventType>(event: T, listener: Listener<T>): void;
export declare function emit(event: FsbEvent): void;
export {};
