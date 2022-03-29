import * as React from 'react';
import type { TextInput } from 'react-native';
import { useHover } from '@tonlabs/uikit.controls';
import {
    useMaterialTextViewChildren,
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
    useExtendedRef,
    useAutogrow,
    useImperativeChange,
    useInputHasValue,
    useClear,
} from './hooks';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';
import type {
    UIMaterialTextViewRef,
    UIMaterialTextViewProps,
    UIMaterialTextViewLayoutProps,
} from './types';
import { useApplyMask } from '../useApplyMask';
import { useFocused } from '../UITextView';
import { useOnSelectionChange } from '../useApplyMask/useOnSelectionChange';

function useExtendedProps(
    props: UIMaterialTextViewProps,
    ref: React.RefObject<TextInput>,
    passedRef: React.ForwardedRef<UIMaterialTextViewRef>,
): UIMaterialTextViewLayoutProps {
    const {
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
        onSelectionChange: onSelectionChangeProp,
    } = props;

    const { inputHasValue, onChangeText: onChangeTextWithInputHasValue } = useInputHasValue(
        value,
        defaultValue,
        onChangeTextProp,
    );

    const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const { onContentSizeChange, onChange, numberOfLines, resetInputHeight } = useAutogrow(
        ref,
        onContentSizeChangeProp,
        onChangeProp,
        multiline,
        numberOfLinesProp,
        onHeightChange,
        isHovered,
        isFocused,
    );

    const { imperativeChangeText, moveCarret } = useImperativeChange(
        ref,
        onChangeTextWithInputHasValue,
    );

    const { selectionEnd, onSelectionChange, skipNextOnSelectionChange } =
        useOnSelectionChange(onSelectionChangeProp);

    const { onChangeText } = useApplyMask(
        imperativeChangeText,
        moveCarret,
        mask,
        selectionEnd,
        skipNextOnSelectionChange,
    );

    const clear = useClear(resetInputHeight, onChangeText, ref);

    const processedChildren = useMaterialTextViewChildren(
        children,
        inputHasValue,
        isFocused,
        isHovered,
        clear,
    );

    useExtendedRef(passedRef, ref, imperativeChangeText, moveCarret, clear);

    const newProps: UIMaterialTextViewLayoutProps = {
        ...props,
        onContentSizeChange,
        onChange,
        numberOfLines,
        onFocus,
        onBlur,
        children: processedChildren,
        onMouseEnter,
        onMouseLeave,
        isHovered,
        inputHasValue,
        isFocused,
        onChangeText,
        onSelectionChange,
    };

    return newProps;
}

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<TextInput>(null);
        const { label } = props;
        const extendedProps = useExtendedProps(props, ref, passedRef);

        if (label) {
            return <UIMaterialTextViewFloating {...extendedProps} ref={ref} />;
        }
        return <UIMaterialTextViewSimple {...extendedProps} ref={ref} />;
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
