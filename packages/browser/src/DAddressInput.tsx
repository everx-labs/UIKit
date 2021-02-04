import * as React from 'react';
import { Platform, TextInput } from 'react-native';

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
import { UITextView, useAutogrowTextView } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

const MAX_INPUT_LENGTH = 120;
const MAX_INPUT_NUM_OF_LINES = 5;

type OnSendText = (text: string) => void;
type OnHeightChange = (height: number) => void;

type DAddressInputInternalProps = {
    textInputRef: React.RefObject<TextInput>;
    editable: boolean;
    placeholder?: string;
    onSendText: OnSendText;
    onHeightChange?: OnHeightChange;
    onFocus: () => void;
    onBlur: () => void;
};

export function DAddressInputInternal(props: DAddressInputInternalProps) {
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
        MAX_INPUT_NUM_OF_LINES,
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
    });

    return (
        <ChatInputContainer numberOfLines={numberOfLines}>
            <UITextView
                ref={props.textInputRef}
                testID="browser_input"
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
        </ChatInputContainer>
    );
}

type DAddressInputProps = {
    editable: boolean;
    placeholder?: string;

    onSendText: OnSendText;
    onCustomKeyboardVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;

    customKeyboard?: UICustomKeyboardItem;
};

export function DAddressInput(props: DAddressInputProps) {
    const textInputRef = React.useRef<TextInput>(null);
    const {
        customKeyboardVisible,
        toggleKeyboard,
        onKeyboardResigned,
        onFocus,
        onBlur,
    } = useCustomKeyboard(props.onCustomKeyboardVisible, props.editable);

    useBackHandler(textInputRef);

    const input = (
        <DAddressInputInternal
            textInputRef={textInputRef}
            editable={props.editable}
            placeholder={props.placeholder}
            onSendText={props.onSendText}
            onHeightChange={
                Platform.OS === 'web' ? props.onHeightChange : undefined
            }
            onFocus={onFocus}
            onBlur={onBlur}
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
