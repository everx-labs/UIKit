import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
    ChatInputContainer,
    useHasSeveralLinesInInput,
    useChatInputValue,
} from '@tonlabs/uistory.chats';
import { UITextView, UITextViewRef } from '@tonlabs/uikit.inputs';
import { UIInputAccessoryView } from '@tonlabs/uicast.keyboard';
import { UILabel, UILabelRoles, ColorVariants } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';
import { UIPopup } from '@tonlabs/uikit.popups';
import {
    OnHeightChange,
    OnMaxLength,
    OnSendText,
    ValidateAddress,
    ValidationResult,
    ValidationResultStatus,
} from './types';
import { ActionButton } from './ActionButton';
import { useUIBrowserInputOnHeightChange } from './UIBrowserInputHeight';

const MAX_INPUT_LENGTH = 120;
const MAX_INPUT_NUM_OF_LINES = 5;

function useValidation(
    onBaseChangeText: (text: string) => void,
    baseClear: () => void,
    validateAddress: ValidateAddress,
) {
    const emptyValidation = React.useRef({
        status: ValidationResultStatus.None,
    }).current;
    const [validation, setValidation] = React.useState<ValidationResult>(emptyValidation);

    const onChangeText = React.useCallback(
        async (text: string) => {
            onBaseChangeText(text);

            const currentValidation = await validateAddress(text);

            if (
                currentValidation.status !== validation.status ||
                currentValidation.text !== validation.text
            ) {
                setValidation(currentValidation);
            }
        },
        [onBaseChangeText, validateAddress, validation],
    );

    const clear = React.useCallback(() => {
        baseClear();

        setValidation(emptyValidation);
    }, [baseClear, emptyValidation]);

    return {
        validation,
        onChangeText,
        clear,
    };
}

const getHintColor = (status: ValidationResultStatus) => {
    if (status === ValidationResultStatus.Error) {
        return ColorVariants.TextNegative;
    }
    if (status === ValidationResultStatus.Success) {
        return ColorVariants.TextPositive;
    }
    return ColorVariants.TextTertiary;
};

type UIAddressInputInternalProps = {
    textInputRef: React.RefObject<UITextViewRef>;
    placeholder?: string;
    onSendText: OnSendText;
    onHeightChange?: OnHeightChange;
    onMaxLength?: (maxLength: number) => void;

    validateAddress: ValidateAddress;
};

export function UIAddressInputInternal({
    textInputRef,
    onHeightChange,
    onSendText: onSendTextProp,
    validateAddress,
    placeholder,
    onMaxLength: onMaxLengthProp,
}: UIAddressInputInternalProps) {
    const { onNumberOfLinesChange, hasSeveralLinesInInput } = useHasSeveralLinesInInput();

    const [isNoticeVisible, setNoticeVisible] = React.useState(false);

    const onMaxLength = React.useCallback(() => {
        setNoticeVisible(true);
    }, []);

    const hideNotice = React.useCallback(() => {
        setNoticeVisible(false);
    }, []);

    const {
        inputHasValue,
        onChangeText: onBaseChangeText,
        onKeyPress,
        onSendText,
        clear: baseClear,
    } = useChatInputValue({
        ref: textInputRef,
        onSendText: onSendTextProp,
        maxInputLength: MAX_INPUT_LENGTH,
        onMaxLength: onMaxLengthProp || onMaxLength,
    });
    const { validation, onChangeText, clear } = useValidation(
        onBaseChangeText,
        baseClear,
        validateAddress,
    );

    const renderNotice = React.useCallback(() => {
        if (onMaxLengthProp == null) {
            return (
                <UIPopup.Notice
                    type={UIPopup.Notice.Type.TopToast}
                    color={UIPopup.Notice.Color.Primary}
                    visible={isNoticeVisible}
                    title={uiLocalized.formatString(
                        uiLocalized.Chats.Alerts.MessageTooLong,
                        MAX_INPUT_LENGTH.toString(),
                    )}
                    onClose={hideNotice}
                    duration={UIPopup.Notice.Duration.Long}
                />
            );
        }
        return null;
    }, [hideNotice, isNoticeVisible, onMaxLengthProp]);

    return (
        <ChatInputContainer
            hasSeveralLinesInInput={hasSeveralLinesInInput}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    onPress={onSendText}
                    hasError={validation.status === ValidationResultStatus.Error}
                    clear={clear}
                />
            }
            onHeightChange={onHeightChange}
        >
            {validation.text && validation.text.length > 0 ? (
                <UILabel
                    role={UILabelRoles.ParagraphFootnote}
                    color={getHintColor(validation.status)}
                    style={styles.hint}
                    numberOfLines={1}
                >
                    {validation.text}
                </UILabel>
            ) : null}
            <UITextView
                ref={textInputRef}
                testID="browser_address_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                autoFocus
                clearButtonMode="never"
                keyboardType="default"
                editable
                maxLength={MAX_INPUT_LENGTH}
                multiline
                placeholder={placeholder ?? uiLocalized.Browser.AddressInput.Placeholder}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                maxNumberOfLines={MAX_INPUT_NUM_OF_LINES}
                onNumberOfLinesChange={onNumberOfLinesChange}
            />
            {renderNotice()}
        </ChatInputContainer>
    );
}

type UIAddressInputProps = {
    placeholder?: string;

    onSendText: OnSendText;
    onMaxLength?: OnMaxLength;

    validateAddress: ValidateAddress;
};

export function UIAddressInput({
    placeholder,
    onSendText,
    onMaxLength,
    validateAddress,
}: UIAddressInputProps) {
    const textInputRef = React.useRef<UITextViewRef>(null);

    const onHeightChange = useUIBrowserInputOnHeightChange();

    return (
        <UIInputAccessoryView managedScrollViewNativeID="browserList">
            <UIAddressInputInternal
                textInputRef={textInputRef}
                placeholder={placeholder}
                onSendText={onSendText}
                onHeightChange={onHeightChange}
                onMaxLength={onMaxLength}
                validateAddress={validateAddress}
            />
        </UIInputAccessoryView>
    );
}

const styles = StyleSheet.create({
    hint: { marginBottom: 4 },
});
