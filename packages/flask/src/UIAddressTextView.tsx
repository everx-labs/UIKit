import * as React from 'react';
import type { TextInput } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import {
    useUITextViewValue,
    UIMaterialTextView,
    UIMaterialTextViewProps,
    UIQRCodeScannerSheet,
    ColorVariants,
    UIMaterialTextViewRef,
} from '@tonlabs/uikit.hydrogen';

export type UIAddressTextViewValidationResult = {
    helperText?: string;
    success?: boolean;
    error?: boolean;
};

export type UIAddressTextViewValidateAddress = (
    address: string,
) => Promise<UIAddressTextViewValidationResult | null>;

type UIAddressTextViewProps = UIMaterialTextViewProps & {
    validateAddress: UIAddressTextViewValidateAddress;
    qrCode: {
        parseData: (data: any) => Promise<string>;
    };
};

function useAddressTextView(
    ref: React.Ref<TextInput> | null,
    props: UIAddressTextViewProps,
) {
    const {
        inputValue,
        onChangeText: onChangeTextBase,
        onKeyPress: onKeyPressBase,
    } = useUITextViewValue(ref, true, props);
    const { validateAddress, onSubmitEditing } = props;
    const [
        validation,
        setValidation,
    ] = React.useState<UIAddressTextViewValidationResult | null>(null);

    const onChangeText = React.useCallback(
        async (t: string) => {
            const text = onChangeTextBase(t);

            const currentValidation = await validateAddress(text);

            if (
                currentValidation?.helperText !== validation?.helperText ||
                currentValidation?.success !== validation?.success ||
                currentValidation?.error !== validation?.error
            ) {
                setValidation(currentValidation);
            }
        },
        [validateAddress, validation, onChangeTextBase],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            const wasClearedWithEnter = onKeyPressBase(e);

            if (wasClearedWithEnter && onSubmitEditing) {
                onSubmitEditing({
                    nativeEvent: { text: inputValue.current },
                } as any);
            }
        },
        [onKeyPressBase, inputValue, onSubmitEditing],
    );

    return {
        onChangeText,
        onKeyPress,
        helperText: validation?.helperText || props.helperText,
        success: validation?.success || props.success,
        error: validation?.error || props.error,
    };
}

export const UIAddressTextView = React.forwardRef<
    UIMaterialTextViewRef,
    UIAddressTextViewProps
>(function UIAddressTextViewForwarded(
    props: UIAddressTextViewProps,
    passedRef,
) {
    const localRef = React.useRef<UIMaterialTextViewRef>(null);
    const ref = passedRef || localRef;
    const {
        // To not pass it as a prop to UIMaterialTextView
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validateAddress,
        qrCode,
        ...rest
    } = props;
    const {
        onChangeText,
        onKeyPress,
        helperText,
        success,
        error,
    } = useAddressTextView(ref, props);
    const [qrVisible, setQrVisible] = React.useState(false);

    const onRead = React.useCallback(
        async (e: any) => {
            const address = await qrCode.parseData(e.data);

            if (ref && 'current' in ref) {
                ref.current?.changeText(address);
            }

            if (onChangeText) {
                onChangeText(address);
            }
        },
        [qrCode, ref, onChangeText],
    );

    return (
        <>
            <UIMaterialTextView
                ref={ref}
                {...rest}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                multiline
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                helperText={helperText}
                success={success}
                error={error}
            >
                {props.children}
                <UIMaterialTextView.Icon
                    testID="address_text_view_scanner"
                    source={UIAssets.icons.addressInput.scan}
                    onPress={() => {
                        setQrVisible(!qrVisible);
                    }}
                    tintColor={ColorVariants.TextAccent}
                />
            </UIMaterialTextView>
            <UIQRCodeScannerSheet
                visible={qrVisible}
                onClose={() => setQrVisible(false)}
                onRead={onRead}
            />
        </>
    );
});
