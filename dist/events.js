// src/events.ts
import * as EventEmitter from "node:events";
var emitter = new EventEmitter;
function on(event, listener) {
  emitter.on(event, listener);
}
function once(event, listener) {
  emitter.once(event, listener);
}
function off(event, listener) {
  emitter.off(event, listener);
}
function emit(event) {
  emitter.emit(event.type, event);
}
export {
  once,
  on,
  off,
  emit
};

export { on, once, off, emit };

//# debugId=13159959F9C53AF264756E2164756E21
//# sourceMappingURL=events.js.map
