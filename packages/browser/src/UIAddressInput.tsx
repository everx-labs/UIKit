import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import {
    UICustomKeyboard,
    useCustomKeyboard,
    UICustomKeyboardItem,
} from '@tonlabs/uikit.keyboard';
import {
    useBackHandler,
    ChatInputContainer,
    useChatInputValue,
    useChatMaxLengthAlert,
} from '@tonlabs/uikit.chats';
import {
    ColorVariants,
    UITextView,
    useAutogrowTextView,
    UILabel,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    OnHeightChange,
    OnSendText,
    ValidateAddress,
    ValidationResult,
    ValidationResultStatus,
} from './types';
import { ActionButton } from './ActionButton';

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
    const [validation, setValidation] = React.useState<ValidationResult>(
        emptyValidation,
    );

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
    textInputRef: React.RefObject<TextInput>;
    placeholder?: string;
    onSendText: OnSendText;
    onHeightChange?: OnHeightChange;
    onFocus: () => void;
    onBlur: () => void;

    validateAddress: ValidateAddress;
};

export function UIAddressInputInternal({
    textInputRef,
    onHeightChange,
    onSendText: onSendTextProp,
    validateAddress,
    placeholder,
    onBlur,
    onFocus,
}: UIAddressInputInternalProps) {
    const {
        onContentSizeChange,
        onChange,
        inputStyle,
        numberOfLines,
        numberOfLinesProp,
        resetInputHeight,
    } = useAutogrowTextView(
        textInputRef,
        onHeightChange,
        MAX_INPUT_NUM_OF_LINES,
    );

    const showMaxLengthAlert = useChatMaxLengthAlert(MAX_INPUT_LENGTH);
    const {
        inputHasValue,
        onChangeText: onBaseChangeText,
        onKeyPress,
        onSendText,
        clear: baseClear,
    } = useChatInputValue({
        ref: textInputRef,
        onSendText: onSendTextProp,
        showMaxLengthAlert,
        resetInputHeight,
        maxInputLength: MAX_INPUT_LENGTH,
    });
    const { validation, onChangeText, clear } = useValidation(
        onBaseChangeText,
        baseClear,
        validateAddress,
    );

    return (
        <ChatInputContainer
            numberOfLines={numberOfLines}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    onPress={onSendText}
                    hasError={
                        validation.status === ValidationResultStatus.Error
                    }
                    clear={clear}
                />
            }
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
                testID="browser_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                autoFocus
                clearButtonMode="never"
                keyboardType="default"
                editable
                maxLength={MAX_INPUT_LENGTH}
                multiline
                numberOfLines={numberOfLinesProp}
                placeholder={
                    placeholder ?? uiLocalized.Browser.AddressInput.Placeholder
                }
                onContentSizeChange={onContentSizeChange}
                onChange={onChange}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
                style={inputStyle}
            />
        </ChatInputContainer>
    );
}

type UIAddressInputProps = {
    placeholder?: string;

    onSendText: OnSendText;
    onCustomKeyboardVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;

    customKeyboard?: UICustomKeyboardItem;
    validateAddress: ValidateAddress;
};

export function UIAddressInput(props: UIAddressInputProps) {
    const textInputRef = React.useRef<TextInput>(null);
    const { onHeightChange } = props;
    const {
        customKeyboardVisible,
        toggleKeyboard,
        onKeyboardResigned,
        onFocus,
        onBlur,
    } = useCustomKeyboard(props.onCustomKeyboardVisible, true);

    useBackHandler(textInputRef);

    React.useEffect(
        () => () => {
            if (onHeightChange) {
                // If inputs is unmounted need to reset insets for list
                onHeightChange(0);
            }
        },
        [onHeightChange],
    );

    const input = (
        <UIAddressInputInternal
            textInputRef={textInputRef}
            placeholder={props.placeholder}
            onSendText={props.onSendText}
            onHeightChange={Platform.OS === 'web' ? onHeightChange : undefined}
            onFocus={onFocus}
            onBlur={onBlur}
            validateAddress={props.validateAddress}
        />
    );

    return (
        <UICustomKeyboard
            renderContent={() => input}
            kbInputRef={textInputRef}
            kbID={props.customKeyboard?.kbID}
            customKeyboardVisible={customKeyboardVisible}
            customKeyboardComponent={props.customKeyboard?.component}
            kbInitialProps={props.customKeyboard?.props}
            onItemSelected={(_id: string | undefined, stk: any) => {
                toggleKeyboard();

                props.customKeyboard?.onItemSelected(_id, stk);
            }}
            onKeyboardResigned={onKeyboardResigned}
            onHeightChange={props.onHeightChange}
        />
    );
}

const styles = StyleSheet.create({
    hint: { marginBottom: 4 },
});
