import * as React from 'react';
// import type BigNumber from 'bignumber.js';
// import type { SharedValue } from 'react-native-reanimated';
import type { UIAmountInputProps, UIAmountInputRef } from './types';
import { UIAmountInputContent } from './UIAmountInputContent';
import { AmountInputContext, getDefaultContext } from './constants';
import { InputIcon, InputAction, InputText } from '../InputChildren';

export const UIAmountInputForward = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputForward(
        props: UIAmountInputProps,
        forwardedRef: React.Ref<UIAmountInputRef>,
    ) {
        const contextValue = React.useMemo(() => getDefaultContext(), []);
        return (
            <AmountInputContext.Provider value={contextValue}>
                <UIAmountInputContent ref={forwardedRef} {...props} />
            </AmountInputContext.Provider>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIAmountInput: typeof UIAmountInputForward & {
    Icon: typeof InputIcon;
    Action: typeof InputAction;
    Text: typeof InputText;
} = UIAmountInputForward;

UIAmountInput.Icon = InputIcon;
UIAmountInput.Action = InputAction;
UIAmountInput.Text = InputText;
