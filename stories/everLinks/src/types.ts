import type BigNumber from 'bignumber.js';

export type UISendSheetParams = {
    address: string;
    amount: BigNumber;
    fee: BigNumber;
    onConfirm: () => void;
    signChar: string;
};
