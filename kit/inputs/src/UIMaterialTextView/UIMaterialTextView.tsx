import * as React from 'react';
import type { TextInput } from 'react-native';
import { useHover } from '@tonlabs/uikit.controls';
import {
    useMaterialTextViewChildren,
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';
import type {
    UIMaterialTextViewRef,
    UIMaterialTextViewProps,
    UIMaterialTextViewLayoutProps,
} from './types';
import { useApplyMask } from '../useApplyMask';
import { useExtendedRef } from './useExtendedRef';
import { useFocused } from '../UITextView';
import { useAutogrow } from './useAutogrow';
import { useInteract } from './useInteract';
import { useInputHasValue } from './useInputHasValue';

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<TextInput>(null);
        const {
            label,
            mask,
            children,
            onHeightChange,
            multiline,
            value,
            defaultValue,
            onChangeText: onChangeTextProp,
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            numberOfLines: numberOfLinesProp,
            onFocus: onFocusProp,
            onBlur: onBlurProp,
        } = props;

        const { inputHasValue, onChangeText } = useInputHasValue(
            value,
            defaultValue,
            onChangeTextProp,
        );
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { onContentSizeChange, onChange, numberOfLines, style, resetInputHeight } =
            useAutogrow(
                ref,
                onContentSizeChangeProp,
                onChangeProp,
                multiline,
                numberOfLinesProp,
                onHeightChange,
            );
        const { changeText, clear, moveCarret } = useInteract(
            ref,
            multiline,
            onChangeText,
            resetInputHeight,
        );
        const { isHovered, onMouseEnter, onMouseLeave } = useHover();
        const processedChildren = useMaterialTextViewChildren(
            children,
            inputHasValue,
            isFocused,
            isHovered,
            clear,
        );

        useExtendedRef(passedRef, ref, changeText, moveCarret);

        const formattingProps = useApplyMask(changeText, moveCarret, mask);

        const newProps: UIMaterialTextViewLayoutProps = {
            onContentSizeChange,
            onChange,
            numberOfLines,
            onFocus,
            onBlur,
            style,
            children: processedChildren,
            onMouseEnter,
            onMouseLeave,
            isHovered,
            inputHasValue,
            isFocused,
            ...formattingProps,
        };

        if (label) {
            return <UIMaterialTextViewFloating {...props} {...newProps} ref={ref} />;
        }
        return <UIMaterialTextViewSimple {...props} {...newProps} ref={ref} />;
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof UIMaterialTextViewIcon;
    Action: typeof UIMaterialTextViewAction;
    Text: typeof UIMaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = UIMaterialTextViewIcon;
UIMaterialTextView.Action = UIMaterialTextViewAction;
UIMaterialTextView.Text = UIMaterialTextViewText;
