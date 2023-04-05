import * as React from 'react';
import {
    getEmptyUIMaterialTextViewRef,
    MaterialTextView,
    useInputHasValue,
    MaterialTextViewRef,
} from '../MaterialTextView';
import { useFocused } from '../UITextView';
import { useUIMaterialTextViewChildren } from './hooks';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';
import { InputIcon, InputAction, InputText, InputColorScheme } from '../Common';

const emptyUIMaterialTextViewRef = getEmptyUIMaterialTextViewRef('UIMaterialTextView');

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<MaterialTextViewRef>(null);
        const {
            value,
            defaultValue,
            onFocus: onFocusProp,
            onBlur: onBlurProp,
            onChangeText: onChangeTextProp,
            onHover: onHoverProp,
            children,
            hideClearButton = false,
            editable = true,
            colorScheme = InputColorScheme.Default,
        } = props;
        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValue);

        const processedChildren = useUIMaterialTextViewChildren(
            children,
            colorScheme,
            hideClearButton,
            inputHasValue,
            isFocused,
            isHovered,
            editable,
            ref.current?.clear,
        );

        const onChangeText = React.useCallback(
            function onChangeText(text: string) {
                onChangeTextProp?.(text);
                checkInputHasValue(text);
            },
            [checkInputHasValue, onChangeTextProp],
        );

        const onHover = React.useCallback(
            (hovered: boolean) => {
                setIsHovered(hovered);
                onHoverProp?.(hovered);
            },
            [onHoverProp],
        );

        React.useImperativeHandle<Record<string, any>, MaterialTextViewRef>(
            passedRef,
            (): MaterialTextViewRef => ({
                ...emptyUIMaterialTextViewRef,
                ...ref.current,
            }),
        );

        return (
            <MaterialTextView
                {...props}
                ref={ref}
                onHover={onHover}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
                colorScheme={colorScheme}
            >
                {processedChildren}
            </MaterialTextView>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof InputIcon;
    Action: typeof InputAction;
    Text: typeof InputText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = InputIcon;
UIMaterialTextView.Action = InputAction;
UIMaterialTextView.Text = InputText;
