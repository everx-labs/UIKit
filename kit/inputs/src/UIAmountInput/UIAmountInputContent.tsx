import * as React from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import type { UIAmountInputRef, UIAmountInputProps } from './types';
import { UITextView } from '../UITextView';
import { AmountInputContext, defaultContextValue } from './constants';
import { useAmountInputHandlers, useAmountInputHover } from './hooks';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const UIAmountInputContent = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputContent(
        props: UIAmountInputProps,
        _forwardedRef: React.Ref<UIAmountInputRef>,
    ) {
        const { editable, onFocus, onBlur, onHover, onSelectionChange } = props;
        const { isHovered, isFocused, inputText, formattedText } =
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

        useDerivedValue(() => {
            console.log('UI', {
                isHovered: isHovered.value,
                isFocused: isFocused.value,
                inputText: inputText.value,
                formattedText: formattedText.value,
            });
        });

        const textViewHandlers = useAmountInputHandlers(
            editable,
            onFocus,
            onBlur,
            onSelectionChange,
        );

        const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

        return (
            <Animated.View
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <UITextViewAnimated {...props} {...textViewHandlers} />
            </Animated.View>
        );
    },
);
