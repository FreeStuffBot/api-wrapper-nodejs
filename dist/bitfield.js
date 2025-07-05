// src/bitfield.ts
function createBitfield(from, model) {
  let local = from;
  const iterate = function* () {
    for (const item of Object.keys(model)) {
      if (local & model[item]) {
        yield item;
      }
    }
  };
  return {
    has: (item) => (local & model[item]) !== 0,
    add: (item) => void (local |= model[item]),
    remove: (item) => void (local &= ~model[item]),
    toggle: (item) => void (local ^= model[item]),
    getBits: () => local,
    toString: () => [...iterate()].join(", "),
    toArray: () => [...iterate()],
    size: () => [...iterate()].length,
    [Symbol.iterator]: () => iterate()
  };
}
export {
  createBitfield
};

export { createBitfield };

//# debugId=61E82695F1FB45DA64756E2164756E21
//# sourceMappingURL=bitfield.js.map
