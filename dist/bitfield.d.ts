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
};
export declare function createBitfield<Items extends string>(from: number, model: Record<Items, number>): Bitfield<Items>;
