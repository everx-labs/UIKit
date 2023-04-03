import * as React from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import {
    useUITextViewValue,
    UIMaterialTextView,
    UIMaterialTextViewProps,
    InputChild,
    UIMaterialTextViewRef,
} from '@tonlabs/uikit.inputs';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIQRCodeScannerSheet } from '@tonlabs/uicast.qr-code-scanner-sheet';

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
    /**
     * QR code parser to process a string read through a QR code.
     * If the parser is passed, a button will be displayed to read the QR code through the camera.
     */
    qrCode?: {
        parseData: (data: any) => Promise<string>;
    };
};

function useAddressTextView(
    props: UIAddressTextViewProps,
    ref: React.RefObject<UIMaterialTextViewRef> | React.ForwardedRef<UIMaterialTextViewRef>,
) {
    /**
     * ref is passed as null because types of ref are incompatible
     * and we don't need the clear method
     */
    const {
        inputValue,
        onChangeText: onChangeTextBase,
        onKeyPress: onKeyPressBase,
    } = useUITextViewValue(null, true, props);

    const { validateAddress, onSubmitEditing, onBlur: onBlurBase } = props;

    const [validation, setValidation] = React.useState<UIAddressTextViewValidationResult | null>(
        null,
    );

    const onBlur = React.useCallback(
        async (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            if (onBlurBase) {
                onBlurBase(e);
            }

            const currentValidation = await validateAddress(inputValue.current);

            if (
                currentValidation?.helperText !== validation?.helperText ||
                currentValidation?.success !== validation?.success ||
                currentValidation?.error !== validation?.error
            ) {
                setValidation(currentValidation);
            }
        },
        [validateAddress, validation, inputValue, onBlurBase],
    );

    const onChangeText = React.useCallback(
        async (t: string) => {
            const text = onChangeTextBase(t.trim());

            if (t !== text && ref && 'current' in ref) {
                ref.current?.changeText(text, false);
            }

            const currentValidation = await validateAddress(text);

            if (
                currentValidation?.helperText !== validation?.helperText ||
                currentValidation?.success !== validation?.success ||
                currentValidation?.error !== validation?.error
            ) {
                setValidation(currentValidation);
            }
        },
        [validateAddress, validation, onChangeTextBase, ref],
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
        onBlur,
        onChangeText,
        onKeyPress,
        helperText: validation?.helperText || props.helperText,
        success: validation?.success || props.success,
        error: validation?.error || props.error,
    };
}

export const UIAddressTextView = React.forwardRef<UIMaterialTextViewRef, UIAddressTextViewProps>(
    function UIAddressTextViewForwarded(props: UIAddressTextViewProps, passedRef) {
        const localRef = React.useRef<UIMaterialTextViewRef>(null);
        const ref = passedRef || localRef;
        const {
            // To not pass it as a prop to UIMaterialTextView
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            validateAddress,
            qrCode,
            children,
            ...rest
        } = props;
        const { onBlur, onChangeText, onKeyPress, helperText, success, error } = useAddressTextView(
            props,
            ref,
        );
        const [qrVisible, setQrVisible] = React.useState(false);

        const onRead = React.useCallback(
            async (e: any) => {
                const address = await qrCode?.parseData(e.data);

                if (!address) {
                    setQrVisible(false);
                    return;
                }

                if (ref && 'current' in ref) {
                    ref.current?.changeText(address);
                }

                if (onChangeText) {
                    onChangeText(address);
                }

                setQrVisible(false);
            },
            [qrCode, ref, onChangeText],
        );

        const qrCodeIcon = React.useMemo(() => {
            if (!qrCode) {
                return null;
            }
            return (
                <UIMaterialTextView.Icon
                    key="address_text_view_scanner_button"
                    testID="address_text_view_scanner"
                    source={UIAssets.icons.addressInput.scan}
                    onPress={() => {
                        setQrVisible(prevQRVisible => !prevQRVisible);
                    }}
                    tintColor={ColorVariants.LineNeutral}
                />
            );
        }, [qrCode]);

        const childrenToDisplay = React.useMemo<InputChild[]>(() => {
            const childList: InputChild[] = [];
            if (qrCodeIcon) {
                childList.unshift(qrCodeIcon);
            }
            if (children) {
                childList.unshift(...(React.Children.toArray(children) as InputChild[]));
            }
            return childList;
        }, [children, qrCodeIcon]);

        return (
            <>
                <UIMaterialTextView
                    ref={ref}
                    {...rest}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    multiline
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    onKeyPress={onKeyPress}
                    helperText={helperText}
                    success={success}
                    error={error}
                >
                    {childrenToDisplay}
                </UIMaterialTextView>
                {qrCode ? (
                    <UIQRCodeScannerSheet
                        visible={qrVisible}
                        onClose={() => setQrVisible(false)}
                        onRead={onRead}
                    />
                ) : null}
            </>
        );
    },
);
