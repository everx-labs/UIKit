import * as React from 'react';
// import type BigNumber from 'bignumber.js';
// import type { SharedValue } from 'react-native-reanimated';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from '../MaterialTextView';
import type { UIAmountInputProps, UIAmountInputRef } from './types';
import { UIAmountInputContent } from './UIAmountInputContent';
import { AmountInputContext, defaultContext } from './constants';

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
        return (
            <AmountInputContext.Provider value={defaultContext}>
                <UIAmountInputContent ref={forwardedRef} {...props} />
            </AmountInputContext.Provider>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIAmountInput: typeof UIAmountInputForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIAmountInputForward;

UIAmountInput.Icon = MaterialTextViewIcon;
UIAmountInput.Action = MaterialTextViewAction;
UIAmountInput.Text = MaterialTextViewText;
