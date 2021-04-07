import * as React from 'react';
import type { TextInput } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { useUITextViewValue } from './UITextView';
import {
    UIMaterialTextView,
    UIMaterialTextViewProps,
} from './UIMaterialTextView';
import {
    UIQRCodeScannerSheet,
    UIQRCodeScannerSheetProps,
} from './UIQRCodeScannerSheet';
import { ColorVariants } from './Colors';

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
    onOpenContactBook: () => void;
    onQRCodeRead: UIQRCodeScannerSheetProps['onRead'];
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
    TextInput,
    UIAddressTextViewProps
>(function UIAddressTextViewForwarded(props: UIAddressTextViewProps, ref) {
    const {
        onQRCodeRead,
        onOpenContactBook,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validateAddress,
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
                <UIMaterialTextView.Icon
                    testID="address_text_view_contacts_picker"
                    source={UIAssets.icons.addressInput.book}
                    onPress={onOpenContactBook}
                    tintColor={ColorVariants.TextAccent}
                />
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
                onRead={onQRCodeRead}
            />
        </>
    );
});
