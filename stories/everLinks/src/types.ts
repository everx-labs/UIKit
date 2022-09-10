import type BigNumber from 'bignumber.js';

import type { TONNetNameKey } from '@surf/packages.networks';

export type SendParams = {
    address: string;
    amount: BigNumber;
    fee: BigNumber;
    net: TONNetNameKey;
    onConfirm: () => void;
};
