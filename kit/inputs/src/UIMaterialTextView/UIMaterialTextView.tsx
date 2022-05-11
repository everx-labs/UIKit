import * as React from 'react';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
    MaterialTextView,
    useInputHasValue,
    MaterialTextViewRef,
} from '../MaterialTextView';
import { useFocused } from '../UITextView';
import { useMaterialTextViewChildren } from './hooks/useMaterialTextViewChildren';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';

const emptyMethod = () => null;

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<MaterialTextViewRef>(null);
        const { value, defaultValue, onFocus: onFocusProp, onBlur: onBlurProp, children } = props;
        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValue);
        const processedChildren = useMaterialTextViewChildren(
            children,
            inputHasValue,
            isFocused,
            isHovered,
            ref.current?.clear,
        );

        React.useImperativeHandle<Record<string, any>, MaterialTextViewRef>(
            passedRef,
            (): MaterialTextViewRef => ({
                changeText: ref.current?.changeText || emptyMethod,
                moveCarret: ref.current?.moveCarret || emptyMethod,
                clear: ref.current?.clear || emptyMethod,
                isFocused: ref.current?.isFocused || (() => false),
                focus: ref.current?.focus || emptyMethod,
                blur: ref.current?.blur || emptyMethod,
            }),
        );

        return (
            <MaterialTextView
                {...props}
                ref={passedRef}
                onHover={setIsHovered}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={checkInputHasValue}
            >
                {processedChildren}
            </MaterialTextView>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = MaterialTextViewIcon;
UIMaterialTextView.Action = MaterialTextViewAction;
UIMaterialTextView.Text = MaterialTextViewText;
