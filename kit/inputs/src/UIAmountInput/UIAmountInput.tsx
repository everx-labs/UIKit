import * as React from 'react';
// import type BigNumber from 'bignumber.js';
// import type { SharedValue } from 'react-native-reanimated';
import type { UIAmountInputProps, UIAmountInputRef } from './types';
import { UIAmountInputContent } from './UIAmountInputContent';
import { AmountInputContext, getDefaultContext } from './constants';
import { InputIcon, InputAction, InputText } from '../useInputChildren/InputChildren';

/*
type FocusState = { isFocused: boolean };
type HoverState = { isHovered: boolean };
type ValueState = { value: string; hasValue: boolean };

type TextViewState<T extends Config> = (T['trackFocus'] extends boolean ? FocusState : unknown) &
    (T['trackHover'] extends boolean ? HoverState : unknown) &
    (T['trackValue'] extends boolean ? ValueState : unknown);

type Config = {
    trackHover?: boolean;
    trackFocus?: boolean;
    trackValue?: boolean;
};

function foo<T extends Config>(config: T): TextViewState<T> {
    config;
    return {} as any;
}

const { isFocused, isHovered, value, hasValue } = foo({
    trackFocus: true,
    trackHover: false,
    trackValue: true,
});

isFocused;
isHovered;
value;
hasValue;
*/

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
