import * as React from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
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
    useTheme,
    UIImage,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import type { OnHeightChange, OnSendText } from './types';

type ActionButtonProps = {
    inputHasValue: boolean;
    onSendText: () => void | Promise<void>;
    hasError: boolean;
    clear: () => void;
};

function ActionButton({
    inputHasValue,
    hasError,
    onSendText,
    clear,
}: ActionButtonProps) {
    const theme = useTheme();
    if (hasError) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={actionStyles.buttonContainer}
                onPress={clear}
            >
                <View
                    style={[
                        actionStyles.iconRound,
                        {
                            backgroundColor:
                                theme[ColorVariants.BackgroundPrimaryInverted],
                        },
                    ]}
                >
                    <UIImage
                        source={UIAssets.icons.ui.closeRemove}
                        style={actionStyles.icon}
                        tintColor={theme[ColorVariants.LinePrimary]}
                    />
                </View>
            </TouchableOpacity>
        );
    }
    if (inputHasValue) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={actionStyles.buttonContainer}
                onPress={onSendText}
            >
                <UIImage
                    source={UIAssets.icons.ui.buttonMsgSend}
                    style={actionStyles.icon}
                />
            </TouchableOpacity>
        );
    }
    return null;
}

const actionStyles = StyleSheet.create({
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.tinyButtonHeight(),
        width: UIConstant.tinyButtonHeight(),
    },
    iconRound: {
        height: UIConstant.tinyButtonHeight(),
        width: UIConstant.tinyButtonHeight(),
        borderRadius: UIConstant.tinyButtonHeight() / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const MAX_INPUT_LENGTH = 120;
const MAX_INPUT_NUM_OF_LINES = 5;

type DAddressInputInternalProps = {
    textInputRef: React.RefObject<TextInput>;
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
        clear,
    } = useChatInputValue({
        ref: props.textInputRef,
        onSendText: props.onSendText,
        showMaxLengthAlert,
        resetInputHeight,
    });

    return (
        <ChatInputContainer
            numberOfLines={numberOfLines}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    onSendText={onSendText}
                    hasError={false /* TODO */}
                    clear={clear}
                />
            }
        >
            <UITextView
                ref={props.textInputRef}
                testID="browser_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                clearButtonMode="never"
                keyboardType="default"
                editable
                maxLength={MAX_INPUT_LENGTH}
                multiline
                numberOfLines={numberOfLinesProp}
                placeholder={
                    props.placeholder ??
                    uiLocalized.Browser.AddressInput.Placeholder
                }
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
