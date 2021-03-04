import * as React from 'react';
import type { TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';
import { UITextView, useAutogrowTextView } from '@tonlabs/uikit.hydrogen';
import type { OnCustomKeyboardVisible } from '@tonlabs/uikit.keyboard';

import { ChatInputContainer } from './ChatInputContainer';
import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickActions';
import { useChatInputValue } from './useChatInputValue';
import { useChatMaxLengthAlert } from './useChatMaxLengthAlert';
import type {
    MenuItem,
    QuickActionItem,
    OnSendText,
    OnHeightChange,
    Shortcut,
} from './types';

const MAX_INPUT_LENGTH = 320;

const CHAT_INPUT_NUM_OF_LINES = 5;

type ChatInputProps = {
    textInputRef: React.RefObject<TextInput>;

    autoFocus?: boolean;
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
    const showMaxLengthAlert = useChatMaxLengthAlert(MAX_INPUT_LENGTH);
    const {
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
    } = useChatInputValue({
        ref: props.textInputRef,
        onSendText: props.onSendText,
        showMaxLengthAlert,
        resetInputHeight,
        maxInputLength: MAX_INPUT_LENGTH,
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
                    autoFocus={props.autoFocus}
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
