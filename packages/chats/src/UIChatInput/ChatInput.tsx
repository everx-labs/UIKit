import * as React from 'react';
import { Platform, StyleSheet, View, TextInput } from 'react-native';

import { UIConstant, UIColor, UIStyle } from '@tonlabs/uikit.core';
import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickAction';
import { StickerButton } from './StickerButton';

import type { MenuItem } from './types';

import { useTheme } from '../useTheme';

const MAX_INPUT_LENGTH = 320;

type OnSendText = (text: string) => void;
type OnHeightChange = (height: number) => void;

type Props = {
    containerStyle?: StyleProp<ViewStyle>;

    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
    quickAction?: MenuItem[];

    inputHidden?: boolean;
    showBorder?: boolean;
    hasStickers?: boolean;
    stickersActive?: boolean;

    onSendText?: OnSendText;
    onStickersPress?: (visible: boolean) => void;
    // TODO: can we not expose it?
    onHeightChange: OnHeightChange;
};

function useInputValue({
    onSendText: onSendTextProp,
    showMaxLengthAlert,
}: {
    onSendText: OnSendText;
    showMaxLengthAlert: () => void;
}) {
    const inputRef = React.useRef();
    // Little optimisation to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(false);
    const inputValue = React.useRef('');
    const wasClearedWithEnter = React.useRef(false);

    const onSendText = React.useCallback(() => {
        if (onSendTextProp) {
            onSendTextProp(inputValue.current);
        }

        inputRef.current?.clear();
        inputValue.current = '';
        setInputHasValue(false);
    }, []);

    const onChangeText = React.useCallback((text: string) => {
        // It could be that we sent a message with "Enter" from keyboard
        // But the event with newline is fired after this
        // So, to prevent setting it, need to check a flag
        // And also check that input string is a newline
        if (wasClearedWithEnter.current && text === '\n') {
            wasClearedWithEnter.current = false;
            return;
        }

        inputValue.current = text;

        const hasValue = text && text.length;

        if (hasValue !== inputHasValue) {
            setInputHasValue(hasValue);
        }

        if (text.length >= MAX_INPUT_LENGTH) {
            showMaxLengthAlert();
        }
    }, []);

    const onKeyPress = React.useCallback((e: any) => {
        // Enable only for web (in native e.key is undefined)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendText();
            wasClearedWithEnter.current = true;
            return;
        }

        const eventKey = e.key || e.nativeEvent?.key;
        if (
            eventKey !== 'Backspace' &&
            inputValue.current.length === MAX_INPUT_LENGTH
        ) {
            showMaxLengthAlert();
        }
    });

    return {
        inputRef,
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
    };
}

function useMaxLengthAlert() {
    const isAlertShown = React.useRef(false);

    return React.useCallback(() => {
        if (!isAlertShown.current) {
            isAlertShown.current = true;
            UIDropdownAlert.showNotification(
                // TODO: move localization!
                // TONLocalized.formatString(
                //     TONLocalized.chats.message.messageTooLong,
                //     MAX_INPUT_LENGTH
                // ),
                'message is too long',
                undefined,
                () => {
                    isAlertShown.current = false;
                }
            );
        }
    }, []);
}

function useInputAdjustHeight(onHeightChange?: OnHeightChange) {
    const [inputHeight, setInputHeight] = React.useState(
        UIConstant.smallCellHeight()
    );

    const onContentSizeChange = React.useCallback((event: any) => {
        if (Platform.OS !== 'web' && event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            const height = contentSize?.height || 0;
            if (height > 0) {
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }

            if (Platform.OS === 'ios') {
                // iOS input have the own multiline native auto-grow behaviour
                // No need to adjust the height
                return;
            }
            const constrainedHeight = Math.min(
                height,
                UIConstant.smallCellHeight() * 5
            );
            setInputHeight(constrainedHeight);
        }
    }, []);

    return {
        inputHeight,
        onContentSizeChange,
    };
}

export function ChatInput(props: Props) {
    const theme = useTheme();

    const { inputHeight, onContentSizeChange } = useInputAdjustHeight(
        props.onHeightChange
    );
    const showMaxLengthAlert = useMaxLengthAlert();
    const {
        inputRef,
        inputHasValue,
        onChangeText,
        onKeyPress,
        onSendText,
    } = useInputValue({
        onSendText: props.onSendText,
        showMaxLengthAlert,
    });

    return (
        <View style={styles.container}>
            <MenuPlus
                menuPlus={props.menuPlus}
                menuPlusDisabled={props.menuPlusDisabled}
            />
            <View style={styles.inputMsg}>
                <TextInput
                    ref={inputRef}
                    testID="chat_input"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    keyboardType="default"
                    maxLength={MAX_INPUT_LENGTH}
                    multiline={true}
                    numberOfLines={Math.round(
                        inputHeight / UIConstant.smallCellHeight()
                    )}
                    noPersonalizedLearning={false}
                    clearButtonMode="never"
                    placeholder={uiLocalized.TypeMessage}
                    placeholderTextColor={UIColor.textPlaceholder(theme)}
                    underlineColorAndroid="transparent"
                    onContentSizeChange={onContentSizeChange}
                    onChangeText={onChangeText}
                    onKeyPress={onKeyPress}
                    style={[
                        UIColor.textPrimaryStyle(theme),
                        UIStyle.text.bodyRegular(),
                        UIStyle.common.flex(),
                        styles.input,
                        Platform.OS === 'android'
                            ? { minHeight: inputHeight }
                            : null,
                    ]}
                />
            </View>
            <StickerButton
                hasStickers={props.hasStickers}
                stickersActive={props.stickersActive}
                inputHasValue={inputHasValue}
                onPress={props.onStickersPress}
            />
            <QuickAction
                quickAction={props.quickAction}
                inputHasValue={inputHasValue}
                onSendText={onSendText}
            />
            <MenuMore
                menuMore={props.menuMore}
                menuMoreDisabled={props.menuMoreDisabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    inputMsg: {
        flex: 1,
        marginVertical: 0,
        paddingBottom: Platform.select({
            // compensate mobile textContainer's default padding
            android: 10,
            ios: 17,
            web: 15,
        }),
        paddingTop: Platform.select({
            // compensate mobile textContainer's default padding
            android: 10,
            ios: 0, // has it's own top padding in a native text container
            web: 10,
        }),
    },
    input: {
        padding: 0,
        // We remove the fontFamily for Android in order to eliminate jumping input behaviour
        ...(Platform.OS === 'android' ? { fontFamily: undefined } : null),
        ...{
            marginTop:
                Platform.OS === 'ios' && process.env.NODE_ENV === 'production'
                    ? 5 // seems to be smth connected to iOS's textContainerInset
                    : 0,
            maxHeight: UIConstant.chatInputMaxHeight(),
        },
    },
});
