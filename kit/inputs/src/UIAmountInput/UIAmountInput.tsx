import * as React from 'react';
import {
    MaterialTextView,
    MaterialTextViewRef,
    MaterialTextViewMask,
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from '../MaterialTextView';
import { useExtendedRef, useHelperTextStatus, useMask, useOnChangeText } from './hooks';
import type { UIAmountInputProps, UIAmountInputRef } from './types';

export const UIAmountInputForward = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputForward(
        props: UIAmountInputProps,
        forwardedRed: React.Ref<UIAmountInputRef>,
    ) {
        const { onChangeAmount, defaultAmount, decimalAspect, messageType, message, ...restProps } =
            props;

        const localRef = React.useRef<MaterialTextViewRef>(null);

        const onChangeText = useOnChangeText(onChangeAmount, localRef);

        useExtendedRef(forwardedRed, localRef);

        const mask: MaterialTextViewMask = useMask(decimalAspect);

        const defaultValue = React.useMemo(() => {
            return defaultAmount?.toString();
        }, [defaultAmount]);

        const { error, warning, success } = useHelperTextStatus(messageType);

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
                keyboardType="decimal-pad"
            />
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
