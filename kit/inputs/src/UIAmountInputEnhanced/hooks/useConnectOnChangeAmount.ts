import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import type { UIAmountInputEnhancedProps } from '../types';
import { AmountInputContext } from '../constants';

export function useConnectOnChangeAmount(
    onChangeAmountProp: UIAmountInputEnhancedProps['onChangeAmount'],
): void {
    const { normalizedText } = React.useContext(AmountInputContext);

    const onChangeAmount = React.useCallback(
        (normalizedNumber: string) => {
            if (onChangeAmountProp) {
                const value = new BigNumber(normalizedNumber);
                onChangeAmountProp(value);
            }
        },
        [onChangeAmountProp],
    );

    /**
     * normalizedText has changed
     */
    useAnimatedReaction(
        () => normalizedText.value,
        (currentNormalizedText, previousNormalizedText) => {
            if (currentNormalizedText !== previousNormalizedText) {
                runOnJS(onChangeAmount)(currentNormalizedText);
            }
        },
    );
}
