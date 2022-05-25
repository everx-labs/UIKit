import * as React from 'react';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { useHover } from '@tonlabs/uikit.controls';

import {
    useExtendedRef,
    useImperativeChange,
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
import type { UITextViewRef } from '../UITextView';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from './MaterialTextViewChildren';
import { useTextViewHandler } from '../useTextViewHandler';

function useExtendedProps(
    props: MaterialTextViewProps,
    ref: React.RefObject<UITextViewRef>,
    passedRef: React.ForwardedRef<MaterialTextViewRef>,
): MaterialTextViewLayoutProps {
    // At first extract props that we don't to pass through
    const {
        defaultValue: defaultValueProp,
        onChangeText: onChangeTextProp,
        // Suppress eslint, as we have to extract from props
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onChange: onChangeProp,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        onSelectionChange: onSelectionChangeProp,
        ...restProps
    } = props;
    const { mask, value, onHover, editable: editableProp } = restProps;

    const editable = useDerivedValue(() => editableProp, [editableProp]);

    const { selectionEnd, skipNextOnSelectionChange, onSelectionChange } =
        useOnSelectionChange(onSelectionChangeProp);

    const applyMask = useApplyMask(mask, selectionEnd, skipNextOnSelectionChange);

    const defaultValueRef = React.useRef<string>();
    if (defaultValueProp && defaultValueRef.current == null) {
        defaultValueRef.current = applyMask(defaultValueProp).formattedText;
    }

    const hasValue = useSharedValue(!!value || !!defaultValueRef.current);

    const checkInputHasValue = React.useCallback(
        (text: string) => {
            hasValue.value = text.length > 0;
        },
        [hasValue],
    );

    const isFocused = useSharedValue(false);

    const { imperativeChangeText, moveCarret, applyTextChange } = useImperativeChange(
        ref,
        onChangeTextProp,
        checkInputHasValue,
        applyMask,
    );

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    React.useEffect(() => {
        onHover?.(isHovered);
    }, [isHovered, onHover]);

    /**
     * onChange event that we got from reanimated
     * is too fast, that when we apply through the ref directly,
     * it is became overriden on native side,
     * thus wrap it with rAF
     */
    const appointTextChange = React.useCallback(
        (...args: Parameters<typeof applyTextChange>) => {
            requestAnimationFrame(() => {
                applyTextChange(...args);
            });
        },
        [applyTextChange],
    );

    const textViewHandlers = useTextViewHandler({
        onFocus: evt => {
            'worklet';

            if (editable.value === false) {
                return;
            }

            isFocused.value = true;

            if (onFocusProp != null) {
                runOnJS(onFocusProp)({ nativeEvent: evt } as any);
            }
        },
        onBlur: evt => {
            'worklet';

            if (editable.value === false) {
                return;
            }

            isFocused.value = false;

            if (onBlurProp != null) {
                runOnJS(onBlurProp)({ nativeEvent: evt } as any);
            }
        },
        onChange: evt => {
            'worklet';

            const { formattedText, carretPosition } = applyMask(evt.text);

            hasValue.value = formattedText.length > 0;

            runOnJS(appointTextChange)(formattedText, carretPosition, {
                shouldSetNativeProps: formattedText !== evt.text,
            });
        },
        onSelectionChange,
    });

    const clear = useClear(imperativeChangeText, ref);

    useExtendedRef(passedRef, ref, imperativeChangeText, moveCarret, clear);

    const newProps: MaterialTextViewLayoutProps = {
        ...restProps,
        ...(editableProp === false
            ? null
            : {
                  onMouseEnter,
                  onMouseLeave,
              }),
        isHovered,
        hasValue,
        isFocused,
        ...textViewHandlers,
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
