import * as React from 'react';
import { useHover } from '@tonlabs/uikit.controls';
import {
    useMaterialTextViewChildren,
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
    useExtendedRef,
    useImperativeChange,
    useInputHasValue,
    useClear,
    useOnSelectionChange,
    useApplyMask,
} from './hooks';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';
import type {
    UIMaterialTextViewRef,
    UIMaterialTextViewProps,
    UIMaterialTextViewLayoutProps,
} from './types';
import { UITextViewRef, useFocused } from '../UITextView';

function useExtendedProps(
    props: UIMaterialTextViewProps,
    ref: React.RefObject<UITextViewRef>,
    passedRef: React.ForwardedRef<UIMaterialTextViewRef>,
): UIMaterialTextViewLayoutProps {
    const {
        mask,
        children,
        value,
        defaultValue: defaultValueProp,
        onChangeText: onChangeTextProp,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        onSelectionChange: onSelectionChangeProp,
    } = props;

    const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValueProp);

    const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    React.useEffect(() => {
        /**
         * We have to force a height measurement to draw it correctly
         * at the first render and after the `Hover` and `isFocused` state has changed
         */
        requestAnimationFrame(() => ref.current?.remeasureInputHeight());
    }, [ref, isHovered, isFocused]);

    const { selectionEnd, onSelectionChange, skipNextOnSelectionChange } =
        useOnSelectionChange(onSelectionChangeProp);

    const applyMask = useApplyMask(mask, selectionEnd, skipNextOnSelectionChange);

    const { imperativeChangeText, moveCarret } = useImperativeChange(
        ref,
        onChangeTextProp,
        checkInputHasValue,
        applyMask,
    );

    const onChangeText = React.useCallback(
        (text: string) =>
            imperativeChangeText(text, {
                shouldSetNativeProps: false,
            }),
        [imperativeChangeText],
    );

    const defaultValueRef = React.useRef<string>();
    if (defaultValueProp && defaultValueRef.current == null) {
        defaultValueRef.current = applyMask(defaultValueProp).formattedText;
    }

    const clear = useClear(imperativeChangeText, ref);

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
        defaultValue: defaultValueRef.current,
    };

    return newProps;
}

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<UITextViewRef>(null);
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
