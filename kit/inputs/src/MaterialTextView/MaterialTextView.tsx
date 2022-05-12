import * as React from 'react';
import { useHover } from '@tonlabs/uikit.controls';
import {
    useExtendedRef,
    useImperativeChange,
    useInputHasValue,
    useClear,
    useOnSelectionChange,
    useApplyMask,
} from './hooks';
import { MaterialTextViewFloating } from './MaterialTextViewFloating';
import { MaterialTextViewSimple } from './MaterialTextViewSimple';
import type {
    MaterialTextViewRef,
    MaterialTextViewProps,
    MaterialTextViewLayoutProps,
} from './types';
import { UITextViewRef, useFocused } from '../UITextView';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from './MaterialTextViewChildren';

function useExtendedProps(
    props: MaterialTextViewProps,
    ref: React.RefObject<UITextViewRef>,
    passedRef: React.ForwardedRef<MaterialTextViewRef>,
): MaterialTextViewLayoutProps {
    const {
        mask,
        value,
        defaultValue: defaultValueProp,
        onChangeText: onChangeTextProp,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        onSelectionChange: onSelectionChangeProp,
        onHover,
    } = props;

    const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValueProp);

    const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    React.useEffect(() => {
        onHover?.(isHovered);
    }, [isHovered, onHover]);

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

    useExtendedRef(passedRef, ref, imperativeChangeText, moveCarret, clear);

    const newProps: MaterialTextViewLayoutProps = {
        ...props,
        onFocus,
        onBlur,
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

const MaterialTextViewForward = React.forwardRef<MaterialTextViewRef, MaterialTextViewProps>(
    function MaterialTextViewForward(props: MaterialTextViewProps, passedRef) {
        const ref = React.useRef<UITextViewRef>(null);
        const { label } = props;
        const extendedProps = useExtendedProps(props, ref, passedRef);

        if (label) {
            return <MaterialTextViewFloating {...extendedProps} ref={ref} />;
        }
        return <MaterialTextViewSimple {...extendedProps} ref={ref} />;
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const MaterialTextView: typeof MaterialTextViewForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = MaterialTextViewForward;

MaterialTextView.Icon = MaterialTextViewIcon;
MaterialTextView.Action = MaterialTextViewAction;
MaterialTextView.Text = MaterialTextViewText;
