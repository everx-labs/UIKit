import * as React from 'react';
import { useFocused } from '../UITextView';
import {
    MaterialTextView,
    MaterialTextViewRef,
    MaterialTextViewMask,
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
    useInputHasValue,
} from '../MaterialTextView';
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
            ...restProps
        } = props;

        const localRef = React.useRef<MaterialTextViewRef>(null);

        const onChangeText = useOnChangeText(onChangeAmount, localRef);

        const mask: MaterialTextViewMask = useMask(decimalAspect);

        const defaultValue = React.useMemo(() => {
            return defaultAmount?.toString();
        }, [defaultAmount]);

        const { error, warning, success } = useHelperTextStatus(messageType);

        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(undefined, undefined);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(
            undefined,
            defaultAmount?.toString(),
        );
        const processedChildren = useUIAmountInputChildren(
            children,
            inputHasValue,
            isFocused,
            isHovered,
            localRef.current?.clear,
        );

        useExtendedRef(forwardedRed, checkInputHasValue, localRef);

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
                onHover={setIsHovered}
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
