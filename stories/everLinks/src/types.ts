import type BigNumber from 'bignumber.js';

export type SendParams = {
    address: string;
    amount: BigNumber;
    fee: BigNumber;
    onConfirm: () => void;
    signChar: string;
};
