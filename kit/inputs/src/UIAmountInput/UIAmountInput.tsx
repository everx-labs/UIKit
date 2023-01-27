import * as React from 'react';
import {
    MaterialTextView,
    MaterialTextViewRef,
    MaterialTextViewMask,
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
    useInputHasValue,
} from '../MaterialTextView';
import { useFocused } from '../UITextView';
import {
    useExtendedRef,
    useHelperTextStatus,
    useMask,
    useOnChangeText,
    useUIAmountInputChildren,
} from './hooks';
import type { UIAmountInputProps, UIAmountInputRef } from './types';

export const UIAmountInputForward = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputForward(
        props: UIAmountInputProps,
        forwardedRed: React.Ref<UIAmountInputRef>,
    ) {
        const {
            onChangeAmount,
            defaultAmount,
            decimalAspect,
            messageType,
            message,
            children,
            hideClearButton = false,
            onFocus: onFocusProp,
            onBlur: onBlurProp,
            onHover: onHoverProp,
            editable = true,
            ...restProps
        } = props;

        const localRef = React.useRef<MaterialTextViewRef>(null);

        const mask: MaterialTextViewMask = useMask(decimalAspect);

        const defaultValue = React.useMemo(() => {
            return defaultAmount?.toFixed();
        }, [defaultAmount]);

        const { error, warning, success } = useHelperTextStatus(messageType);

        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(
            undefined,
            defaultAmount?.toFixed(),
        );
        const onChangeText = useOnChangeText(onChangeAmount, checkInputHasValue, localRef);

        const processedChildren = useUIAmountInputChildren(
            children,
            hideClearButton,
            inputHasValue,
            isFocused,
            isHovered,
            editable,
            localRef.current?.clear,
        );

        useExtendedRef(forwardedRed, checkInputHasValue, localRef);

        const onHover = React.useCallback(
            (hovered: boolean) => {
                setIsHovered(hovered);
                onHoverProp?.(hovered);
            },
            [onHoverProp],
        );

        return (
            <MaterialTextView
                {...restProps}
                ref={localRef}
                defaultValue={defaultValue}
                helperText={message}
                error={error}
                warning={warning}
                success={success}
                mask={mask}
                onChangeText={onChangeText}
                onHover={onHover}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType="decimal-pad"
            >
                {processedChildren}
            </MaterialTextView>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIAmountInput: typeof UIAmountInputForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIAmountInputForward;

UIAmountInput.Icon = MaterialTextViewIcon;
UIAmountInput.Action = MaterialTextViewAction;
UIAmountInput.Text = MaterialTextViewText;
