// @flow
export interface BigNum {
    eq: (x: BigNum) => boolean;
    lt: (x: BigNum) => boolean;
    gt: (x: BigNum) => boolean;
    lte: (x: BigNum) => boolean;
    gte: (x: BigNum) => boolean;

    plus: (x: BigNum) => BigNum;
    minus: (x: BigNum) => BigNum;
    times: (x: BigNum) => BigNum;
    div: (x: BigNum) => BigNum;
    negated: () => BigNum;
    abs: () => BigNum;

    toFixed: (z?: number) => string;
    toNumber: () => number;
}
