import * as React from 'react';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedRef } from 'react-native-reanimated';
import BigNumber from 'bignumber.js';
import { NativeModules } from 'react-native';
import type { UIAmountInputEnhancedRef, UIAmountInputEnhancedProps } from './types';
import { AmountInputContext } from './constants';
import { useAmountInputHandlers, useAmountInputHover } from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputModule?.install();

export const UIAmountInputEnhancedContent = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedContent(
    { children: _children, ...props }: UIAmountInputEnhancedProps,
    _forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    const {
        editable,
        onFocus,
        onBlur,
        onHover,
        onSelectionChange,
        onChangeAmount: onChangeAmountProp,
        precision,
        multiline,
    } = props;
    // @ts-ignore
    const ref = useAnimatedRef<UITextViewRef>();
    const { normalizedText } = React.useContext(AmountInputContext);

    /**
     * TODO Remove
     */
    // useDerivedValue(() => {
    //     console.log('UI', {
    //         isHovered: isHovered.value,
    //         isFocused: isFocused.value,
    //         inputText: inputText.value,
    //         normalizedText: normalizedText.value,
    //         formattedText: formattedText.value,
    //     });
    // });

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

    const textViewHandlers = useAmountInputHandlers(
        ref,
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        precision,
        multiline,
    );

    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    return (
        <Animated.View
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                padding: 8,
                borderWidth: 1,
            }}
        >
            <UITextViewAnimated {...props} {...textViewHandlers} ref={ref} />
        </Animated.View>
    );
});
