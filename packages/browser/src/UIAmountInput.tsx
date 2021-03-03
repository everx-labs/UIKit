import * as React from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import BigNumber from 'bignumber.js';

import { UIConstant } from '@tonlabs/uikit.core';
import { UICustomKeyboard } from '@tonlabs/uikit.keyboard';
import { useBackHandler, ChatInputContainer } from '@tonlabs/uikit.chats';
import {
    UITextView,
    UIImage,
    useUITextViewValue,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import type { OnHeightChange, OnSendAmount } from './types';

type ActionButtonProps = {
    inputHasValue: boolean;
    onPress: () => void | Promise<void>;
};

function ActionButton({ inputHasValue, onPress }: ActionButtonProps) {
    if (inputHasValue) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={actionStyles.buttonContainer}
                onPress={onPress}
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

// function useAmountInputValue({ ref }: { ref: React.RefObject<TextInput> }) {
//     const {} = useUITextViewValue();
// }

type UIAmountInputInternalProps = {
    textInputRef: React.RefObject<TextInput>;
    placeholder?: string;
    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

function UIAmountInputInternal({
    textInputRef,
    onHeightChange,
    onSendAmount: onSendAmountProp,
    placeholder: placeholderProp,
}: UIAmountInputInternalProps) {
    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (event && event.nativeEvent) {
                const { contentSize } = event.nativeEvent;
                const height = contentSize?.height || 0;

                if (height <= 0) {
                    return;
                }

                if (onHeightChange) {
                    onHeightChange(height);
                }
            }
        },
        [onHeightChange],
    );

    const {
        inputHasValue,
        inputValue,
        clear,
        onChangeText: onChangeTextBase,
        onKeyPress,
    } = useUITextViewValue(textInputRef);

    const onChangeText = React.useCallback(
        (text: string) => {
            const hasNotValidCharsRegExp = /[^0-9,.]/g;

            const validatedText = text
                .replace(hasNotValidCharsRegExp, '')
                .split(/[,.]/)
                .slice(0, 2)
                .join(uiLocalized.localeInfo.decimal);

            if (text !== validatedText) {
                textInputRef.current?.setNativeProps({
                    text: validatedText,
                });
            }

            onChangeTextBase(validatedText);
        },
        [textInputRef, onChangeTextBase],
    );

    const [isFocused, setIsFocused] = React.useState(false);

    const onFocus = React.useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const onBlur = React.useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused]);

    const placeholder = React.useMemo(() => {
        if (isFocused) {
            return '.000000000';
        }

        if (placeholderProp) {
            return placeholderProp;
        }

        return uiLocalized.Browser.AmountInput.Placeholder;
    }, [placeholderProp, isFocused]);

    const placeholderColor = React.useMemo(() => {
        if (isFocused) {
            return ColorVariants.TextTertiary;
        }

        return undefined;
    }, [isFocused]);

    const onActionPress = React.useCallback(() => {
        onSendAmountProp(new BigNumber(inputValue.current.replace(',', '.')));
        clear();
    }, [onSendAmountProp, clear, inputValue]);

    return (
        <ChatInputContainer
            numberOfLines={1}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    onPress={onActionPress}
                />
            }
        >
            <UITextView
                ref={textInputRef}
                testID="browser_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                autoFocus
                clearButtonMode="never"
                keyboardType="decimal-pad"
                editable
                maxLength={MAX_INPUT_LENGTH}
                multiline
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                onContentSizeChange={onContentSizeChange}
                // onChange={onChange}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}

                // style={inputStyle}
            />
        </ChatInputContainer>
    );
}

type UIAddressInputProps = {
    placeholder?: string;

    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

export function UIAmountInput(props: UIAddressInputProps) {
    const textInputRef = React.useRef<TextInput>(null);
    const { onHeightChange } = props;

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
        <UIAmountInputInternal
            textInputRef={textInputRef}
            placeholder={props.placeholder}
            onSendAmount={props.onSendAmount}
            onHeightChange={Platform.OS === 'web' ? onHeightChange : undefined}
        />
    );

    return (
        <UICustomKeyboard
            renderContent={() => input}
            kbInputRef={textInputRef}
            onHeightChange={props.onHeightChange}
            customKeyboardVisible={false}
        />
    );
}
