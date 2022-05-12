import * as React from 'react';
import {
    getEmptyUIMaterialTextViewRef,
    MaterialTextViewIcon as UIMaterialTextViewIcon,
    MaterialTextViewAction as UIMaterialTextViewAction,
    MaterialTextViewText as UIMaterialTextViewText,
    MaterialTextView,
    useInputHasValue,
    MaterialTextViewRef,
} from '../MaterialTextView';
import { useFocused } from '../UITextView';
import { useMaterialTextViewChildren } from './hooks/useMaterialTextViewChildren';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';

const emptyUIMaterialTextViewRef = getEmptyUIMaterialTextViewRef('UIMaterialTextView');

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<MaterialTextViewRef>(null);
        const { value, defaultValue, onFocus: onFocusProp, onBlur: onBlurProp, children } = props;
        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValue);
        console.log({ inputHasValue, isFocused, isHovered });
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
                ...emptyUIMaterialTextViewRef,
                ...ref.current,
            }),
        );

        return (
            <MaterialTextView
                {...props}
                ref={ref}
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
    Icon: typeof UIMaterialTextViewIcon;
    Action: typeof UIMaterialTextViewAction;
    Text: typeof UIMaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = UIMaterialTextViewIcon;
UIMaterialTextView.Action = UIMaterialTextViewAction;
UIMaterialTextView.Text = UIMaterialTextViewText;

export { UIMaterialTextViewIcon, UIMaterialTextViewAction, UIMaterialTextViewText };
