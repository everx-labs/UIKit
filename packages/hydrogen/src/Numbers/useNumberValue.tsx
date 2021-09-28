import * as React from 'react';
import BigNumber from 'bignumber.js';
import { bigNumToNumber, UINumberDecimalAspect } from './runOnUILocalizedNumberFormat';

export function useNumberValue(rawValue: number | BigNumber, decimalAspect: UINumberDecimalAspect) {
    return React.useMemo(
        () => (rawValue instanceof BigNumber ? bigNumToNumber(rawValue, decimalAspect) : rawValue),
        [rawValue],
    );
}
