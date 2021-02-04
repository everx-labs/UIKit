import * as React from 'react';
import type { TextInput } from 'react-native';

import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UITextView,
    useUITextViewValue,
    useAutogrowTextView,
} from '@tonlabs/uikit.hydrogen';

import type { OnCustomKeyboardVisible } from '@tonlabs/uikit.keyboard';

import { ChatInputContainer } from './ChatInputContainer';
import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickActions';
import type {
    MenuItem,
    QuickActionItem,
    OnSendText,
    OnHeightChange,
    Shortcut,
} from './types';

const MAX_INPUT_LENGTH = 320;

function useInputValue({
    ref,
    onSendText: onSendTextProp,
    showMaxLengthAlert,
    resetInputHeight,
}: {
    ref: React.RefObject<TextInput>;
    onSendText: OnSendText;
    showMaxLengthAlert: () => void;
    resetInputHeight: () => void;
}) {
    const {
        inputHasValue,
        inputValue,
        clear,
        onChangeText: onBaseChangeText,
        onKeyPress: onBaseKeyPress,
    } = useUITextViewValue(ref, true);

    const onSendText = React.useCallback(() => {
        if (onSendTextProp) {
            onSendTextProp(inputValue.current);
        }

        clear();
        resetInputHeight();
    }, [onSendTextProp, clear, inputValue, resetInputHeight]);

    const onChangeText = React.useCallback(
        (text: string) => {
            onBaseChangeText(text);

            if (text.length >= MAX_INPUT_LENGTH) {
                showMaxLengthAlert();
            }
        },
        [onBaseChangeText, showMaxLengthAlert],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            // Enable only for web (in native e.key is undefined)
            const wasClearedWithEnter = onBaseKeyPress(e);

            if (wasClearedWithEnter) {
                onSendText();
                return;
            }

            const eventKey = e.key || e.nativeEvent?.key;
            if (
                eventKey !== 'Backspace' &&
                inputValue.current.length === MAX_INPUT_LENGTH
            ) {
                showMaxLengthAlert();
            }
        },
        [onSendText, onBaseKeyPress, inputValue, showMaxLengthAlert],
    );

    return {
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
    };
}

function useMaxLengthAlert(maxLength: number) {
    const isAlertShown = React.useRef(false);

    return React.useCallback(() => {
        if (!isAlertShown.current) {
            isAlertShown.current = true;
            UIDropdownAlert.showNotification(
                uiLocalized.formatString(
                    uiLocalized.Chats.Alerts.MessageTooLong,
                    maxLength,
                ),
                undefined,
                () => {
                    isAlertShown.current = false;
                },
            );
        }
    }, [maxLength]);
}

const CHAT_INPUT_NUM_OF_LINES = 5;

type ChatInputProps = {
    textInputRef: React.RefObject<TextInput>;

    editable: boolean;
    placeholder?: string;
    shortcuts?: Shortcut[];
    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
    quickActions?: QuickActionItem[];
    inputHidden?: boolean;

    customKeyboardVisible: boolean;
    onCustomKeyboardPress: OnCustomKeyboardVisible;
    customKeyboardButton?: React.ComponentType<any>;

    onSendText: OnSendText;
    onHeightChange?: OnHeightChange;
    onFocus: () => void;
    onBlur: () => void;
};

export function ChatInput(props: ChatInputProps) {
    const {
        onContentSizeChange,
        onChange,
        inputStyle,
        numberOfLines,
        numberOfLinesProp,
        resetInputHeight,
    } = useAutogrowTextView(
        props.textInputRef,
        props.onHeightChange,
        CHAT_INPUT_NUM_OF_LINES,
    );
    const showMaxLengthAlert = useMaxLengthAlert(MAX_INPUT_LENGTH);
    const {
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
    } = useInputValue({
        ref: props.textInputRef,
        onSendText: props.onSendText,
        showMaxLengthAlert,
        resetInputHeight,
    });

    const CustomKeyboardButton = props.customKeyboardButton;

    return (
        <ChatInputContainer
            numberOfLines={numberOfLines}
            shortcuts={props.shortcuts}
            left={
                props.menuPlus?.length && props.menuPlus?.length > 0 ? (
                    <MenuPlus
                        menuPlus={props.menuPlus}
                        menuPlusDisabled={props.menuPlusDisabled}
                    />
                ) : null
            }
            right={
                <>
                    {CustomKeyboardButton && (
                        <CustomKeyboardButton
                            editable={props.editable}
                            customKeyboardVisible={props.customKeyboardVisible}
                            inputHasValue={inputHasValue}
                            onPress={props.onCustomKeyboardPress}
                        />
                    )}
                    <QuickAction
                        quickActions={props.quickActions}
                        inputHasValue={inputHasValue}
                        onSendText={onSendText}
                    />
                    <MenuMore
                        menuMore={props.menuMore}
                        menuMoreDisabled={props.menuMoreDisabled}
                    />
                </>
            }
        >
            {props.inputHidden ? null : (
                <UITextView
                    ref={props.textInputRef}
                    testID="chat_input"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    clearButtonMode="never"
                    keyboardType="default"
                    editable={props.editable}
                    maxLength={MAX_INPUT_LENGTH}
                    multiline
                    numberOfLines={numberOfLinesProp}
                    placeholder={props.placeholder ?? uiLocalized.TypeMessage}
                    onContentSizeChange={onContentSizeChange}
                    onChange={onChange}
                    onChangeText={onChangeText}
                    onKeyPress={onKeyPress}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    style={inputStyle}
                />
            )}
        </ChatInputContainer>
    );
}
