import * as React from 'react';
import Animated, { runOnJS, useAnimatedReaction, useDerivedValue } from 'react-native-reanimated';
import BigNumber from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import type { UIAmountInputRef, UIAmountInputProps } from './types';
import { UITextView, UITextViewRef } from '../UITextView';
import { AmountInputContext, defaultContextValue } from './constants';
import { useAmountInputHandlers, useAmountInputHover } from './hooks';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const UIAmountInputContent = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputContent(
        props: UIAmountInputProps,
        _forwardedRef: React.Ref<UIAmountInputRef>,
    ) {
        const {
            editable,
            onFocus,
            onBlur,
            onHover,
            onSelectionChange,
            onChangeAmount: onChangeAmountProp,
            precision,
        } = props;
        const ref = React.useRef<UITextViewRef>(null);
        const { isHovered, isFocused, inputText, normalizedText, formattedText } =
            React.useContext(AmountInputContext);

        /**
         * Reset context value after the component unmounting
         */
        React.useLayoutEffect(() => {
            return () => {
                isHovered.value = defaultContextValue.isHovered;
                isFocused.value = defaultContextValue.isFocused;
                inputText.value = defaultContextValue.inputText;
                formattedText.value = defaultContextValue.formattedText;
            };
        });

        /**
         * TODO Remove
         */
        useDerivedValue(() => {
            console.log('UI', {
                isHovered: isHovered.value,
                isFocused: isFocused.value,
                inputText: inputText.value,
                normalizedText: normalizedText.value,
                formattedText: formattedText.value,
            });
        });

        const setText = React.useCallback(
            (text: string) => {
                /**
                 * TODO to think how to do it on UI
                 * text doesn't change without requestAnimationFrame (too quick)
                 */
                requestAnimationFrame(() => {
                    ref.current?.setNativeProps({
                        text,
                    });
                });
            },
            [ref],
        );

        const onChangeAmount = React.useCallback(
            (normalizedNumber: string) => {
                if (onChangeAmountProp) {
                    setTimeout(() => {
                        let stringForBigNumber = normalizedNumber;
                        if (uiLocalized.localeInfo.numbers.decimal !== '.') {
                            stringForBigNumber = stringForBigNumber.replace(
                                uiLocalized.localeInfo.numbers.decimal,
                                '.',
                            );
                        }
                        const value = new BigNumber(stringForBigNumber);

                        if (value.isNaN()) {
                            onChangeAmountProp(undefined);
                        } else {
                            onChangeAmountProp(value);
                        }
                    });
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

        /**
         * inputText has changed
         */
        useAnimatedReaction(
            () => ({ inputText: inputText.value, formattedText: formattedText.value }),
            (currentState, _previousState) => {
                if (currentState.formattedText !== currentState.inputText) {
                    runOnJS(setText)(currentState.formattedText);
                }
            },
        );

        const textViewHandlers = useAmountInputHandlers(
            editable,
            onFocus,
            onBlur,
            onSelectionChange,
            precision,
        );

        const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

        return (
            <Animated.View
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <UITextViewAnimated {...props} {...textViewHandlers} ref={ref} />
            </Animated.View>
        );
    },
);
