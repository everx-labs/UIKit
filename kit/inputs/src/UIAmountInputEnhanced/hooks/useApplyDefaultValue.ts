import React from 'react';
import { runOnUI } from 'react-native-reanimated';
import type BigNumber from 'bignumber.js';
import type { FormatAndSetTextConfig } from '../types';

export function useApplyDefaultValue(
    defaultAmount: BigNumber | undefined,
    formatAndSetText: (text: string, config?: FormatAndSetTextConfig | undefined) => void,
    decimalSeparator: string,
) {
    const defaultAmountRef = React.useRef(defaultAmount);
    const defaultAmountWasApplied = React.useRef(false);

    // React.useEffect(() => {
    //     if (defaultAmountRef.current) {
    //         defaultAmountWasApplied.current = true;
    //         runOnUI(formatAndSetText)(defaultAmountRef.current?.toFormat({ decimalSeparator }), {
    //             callOnChangeProp: false,
    //         });
    //     }
    // }, []);

    const applyDefaultValue = React.useCallback(() => {
        if (defaultAmountRef.current && !defaultAmountWasApplied.current) {
            setTimeout(() => {
                if (defaultAmountRef.current) {
                    defaultAmountWasApplied.current = true;
                    runOnUI(formatAndSetText)(
                        defaultAmountRef.current?.toFormat({ decimalSeparator }),
                        {
                            callOnChangeProp: false,
                        },
                    );
                }
            }, 100);
        }
    }, [decimalSeparator, formatAndSetText]);

    return applyDefaultValue;
}
