

export type Bitfield<Items extends string> = {
  has: (item: Items) => boolean;
  add: (item: Items) => void;
  remove: (item: Items) => void;
  toggle: (item: Items) => void;
  getBits: () => number;
  toString: () => string;
  toArray: () => Items[];
  size: () => number;
  [Symbol.iterator]: () => IterableIterator<Items>;
}

export function createBitfield<Items extends string>(from: number, model: Record<Items, number>): Bitfield<Items> {
  let local = from;

  const iterate = function* () {
    for (const item of Object.keys(model) as Items[]) {
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
    toString : () => [ ...iterate() ].join(', '),
    toArray : () => [ ...iterate() ],
    size: () => [ ...iterate() ].length,
    [Symbol.iterator]: () => iterate(),
  };
}
