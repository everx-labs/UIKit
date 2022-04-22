import * as React from 'react';
import { uiLocalized } from '@tonlabs/localization';
import { UITextView, UITextViewRef } from '@tonlabs/uikit.inputs';
import { UIPopup } from '@tonlabs/uikit.popups';
import type { UIMenuActionProps } from '@tonlabs/uikit.popups';

import { ChatInputContainer } from './ChatInputContainer';
import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickActions';
import { useChatInputValue } from './useChatInputValue';
import type { QuickActionItem, OnSendText, Shortcut } from './types';
import { useChatInputHasSeveralLines } from './useChatInputHasSeveralLines';

const MAX_INPUT_LENGTH = 2 ** 10;

const CHAT_INPUT_NUM_OF_LINES = 5;

type ChatInputProps = {
    textInputRef: React.RefObject<UITextViewRef>;
    autoFocus?: boolean;
    editable: boolean;
    placeholder?: string;
    shortcuts?: Shortcut[];
    menuPlus?: UIMenuActionProps[];
    menuPlusDisabled?: boolean;
    menuMore?: UIMenuActionProps[];
    menuMoreDisabled?: boolean;
    quickActions?: QuickActionItem[];
    inputHidden?: boolean;

    customKeyboardVisible: boolean;
    onCustomKeyboardPress: () => void;
    customKeyboardButton?: React.ComponentType<any>;

    onSendText: OnSendText;
    onFocus: () => void;
    onBlur?: () => void;
    onMaxLength?: (maxLength: number) => void;

    onHeightChange?: (height: number) => void;
};

export function ChatInput({
    textInputRef,
    onSendText: onSendTextProp,
    onMaxLength: onMaxLengthProp,
    customKeyboardButton,
    customKeyboardVisible,
    shortcuts,
    menuPlus,
    menuPlusDisabled,
    menuMore,
    menuMoreDisabled,
    editable,
    onCustomKeyboardPress,
    quickActions,
    inputHidden,
    autoFocus,
    placeholder,
    onFocus,
    onBlur,
    onHeightChange,
}: ChatInputProps) {
    const { onNumberOfLinesChange, hasInputSeveralLines } = useChatInputHasSeveralLines();

    const [isNoticeVisible, setNoticeVisible] = React.useState(false);

    const onMaxLength = React.useCallback(() => {
        setNoticeVisible(true);
    }, []);

    const hideNotice = React.useCallback(() => {
        setNoticeVisible(false);
    }, []);

    const { inputHasValue, onChangeText, onKeyPress, onSendText } = useChatInputValue({
        ref: textInputRef,
        onSendText: onSendTextProp,
        onMaxLength: onMaxLengthProp || onMaxLength,
        maxInputLength: MAX_INPUT_LENGTH,
    });

    const CustomKeyboardButton = customKeyboardButton;

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
            hasInputSeveralLines={hasInputSeveralLines}
            shortcuts={shortcuts}
            left={
                menuPlus?.length && menuPlus?.length > 0 ? (
                    <MenuPlus menuPlus={menuPlus} menuPlusDisabled={menuPlusDisabled} />
                ) : null
            }
            right={
                <>
                    {CustomKeyboardButton && (
                        <CustomKeyboardButton
                            editable={editable}
                            customKeyboardVisible={customKeyboardVisible}
                            inputHasValue={inputHasValue}
                            onPress={onCustomKeyboardPress}
                        />
                    )}
                    <QuickAction
                        quickActions={quickActions}
                        inputHasValue={inputHasValue}
                        onSendText={onSendText}
                    />
                    <MenuMore menuMore={menuMore} menuMoreDisabled={menuMoreDisabled} />
                </>
            }
            onHeightChange={onHeightChange}
        >
            {inputHidden ? null : (
                <UITextView
                    ref={textInputRef}
                    testID="chat_input"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    autoFocus={autoFocus}
                    clearButtonMode="never"
                    keyboardType="default"
                    editable={editable}
                    maxLength={MAX_INPUT_LENGTH}
                    multiline
                    placeholder={placeholder ?? uiLocalized.TypeMessage}
                    onChangeText={onChangeText}
                    onKeyPress={onKeyPress}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxNumberOfLines={CHAT_INPUT_NUM_OF_LINES}
                    onNumberOfLinesChange={onNumberOfLinesChange}
                    defaultValue="фыв фыжв фжывд ьфжывд фжывдь жфдыв фжыьдв жфыдьв жфдыьв жфдфыв "
                />
            )}
            {renderNotice()}
        </ChatInputContainer>
    );
}
