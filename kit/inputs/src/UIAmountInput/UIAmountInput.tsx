import * as React from 'react';
import {
    UIMaterialTextView,
    UIMaterialTextViewRef,
    UIMaterialTextViewMask,
} from '../UIMaterialTextView';
import { useExtendedRef, useHelperTextStatus, useMask, useOnChangeText } from './hooks';
import type { UIAmountInputProps, UIAmountInputRef } from './types';

export const UIAmountInput = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInput(props: UIAmountInputProps, forwardedRed: React.Ref<UIAmountInputRef>) {
        const { onChangeAmount, defaultAmount, decimalAspect, messageType, message, ...restProps } =
            props;

        const localRef = React.useRef<UIMaterialTextViewRef>(null);

        const onChangeText = useOnChangeText(onChangeAmount, localRef);

        useExtendedRef(forwardedRed, localRef);

        const mask: UIMaterialTextViewMask = useMask(decimalAspect);

        const defaultValue = React.useMemo(() => {
            return defaultAmount?.toString();
        }, [defaultAmount]);

        const { error, warning, success } = useHelperTextStatus(messageType);

        return (
            <UIMaterialTextView
                {...restProps}
                ref={localRef}
                defaultValue={defaultValue}
                helperText={message}
                error={error}
                warning={warning}
                success={success}
                mask={mask}
                onChangeText={onChangeText}
                keyboardType="numbers-and-punctuation"
            />
        );
    },
);
