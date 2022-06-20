import * as React from 'react';
// import type BigNumber from 'bignumber.js';
// import type { SharedValue } from 'react-native-reanimated';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from '../MaterialTextView';
import type { UIAmountInputEnhancedProps, UIAmountInputEnhancedRef } from './types';
import { UIAmountInputEnhancedContent } from './UIAmountInputEnhancedContent';
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

export const UIAmountInputEnhancedForward = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedForward(
    props: UIAmountInputEnhancedProps,
    forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    return (
        <AmountInputContext.Provider value={defaultContext}>
            <UIAmountInputEnhancedContent ref={forwardedRef} {...props} />
        </AmountInputContext.Provider>
    );
});

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIAmountInputEnhanced: typeof UIAmountInputEnhancedForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIAmountInputEnhancedForward;

UIAmountInputEnhanced.Icon = MaterialTextViewIcon;
UIAmountInputEnhanced.Action = MaterialTextViewAction;
UIAmountInputEnhanced.Text = MaterialTextViewText;
