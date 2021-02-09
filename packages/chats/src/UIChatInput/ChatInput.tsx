import * as React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TextInput,
    BackHandler,
    Animated,
} from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UITextView,
    useUITextViewValue,
    useTheme,
    ColorVariants,
    useAutogrowTextView,
} from '@tonlabs/uikit.hydrogen';

import {
    UICustomKeyboardUtils,
    OnCustomKeyboardVisible,
} from '@tonlabs/uikit.keyboard';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickActions';
import type {
    MenuItem,
    QuickActionItem,
    OnSendText,
    OnSendMedia,
    OnSendDocument,
    OnHeightChange,
    Shortcut,
} from './types';
import { ChatPicker, ChatPickerRef } from './ChatPicker';
import { Shortcuts } from './Shortcuts';
import { useChatOnScrollListener } from '../useChatOnScrollListener';

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
    }, [onSendTextProp]);

    const onChangeText = React.useCallback(
        (text: string) => {
            onBaseChangeText(text);

            if (text.length >= MAX_INPUT_LENGTH) {
                showMaxLengthAlert();
            }
        },
        [onBaseChangeText],
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
        [onSendText, onBaseKeyPress],
    );

    return {
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
                uiLocalized.formatString(
                    uiLocalized.Chats.Alerts.MessageTooLong,
                    MAX_INPUT_LENGTH,
                ),
                undefined,
                () => {
                    isAlertShown.current = false;
                },
            );
        }
    }, []);
}

const CHAT_INPUT_NUM_OF_LINES = 5;

function useBackHandler(ref: React.RefObject<TextInput>) {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return undefined;
        }

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (ref.current && ref.current.isFocused()) {
                    UICustomKeyboardUtils.dismiss();
                    return true;
                }
                return false;
            },
        );

        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, []);
}

function useAnimatedBorder(numberOfLines: number) {
    const borderOpacity = React.useRef<Animated.Value>(new Animated.Value(0));

    const scrollOffset = React.useRef<number>(0);

    const showBorderIfNeeded = React.useCallback(() => {
        const hasScroll = scrollOffset.current > 1;
        const needToShow = hasScroll || numberOfLines > 1;

        Animated.spring(borderOpacity.current, {
            toValue: needToShow ? 1 : 0,
            useNativeDriver: true,
            speed: 20,
        }).start();
    }, [numberOfLines]);

    useChatOnScrollListener((y: number) => {
        scrollOffset.current = y;

        showBorderIfNeeded();
    });

    React.useEffect(() => {
        showBorderIfNeeded();
    }, [numberOfLines, showBorderIfNeeded]);

    return borderOpacity.current;
}

type Props = {
    textInputRef: React.RefObject<TextInput>;
    pickerRef: React.RefObject<ChatPickerRef>;

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
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onHeightChange?: OnHeightChange;
    onFocus: () => void;
    onBlur: () => void;
};

export function ChatInput(props: Props) {
    const theme = useTheme();

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
    const showMaxLengthAlert = useMaxLengthAlert();
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
    const borderOpacity = useAnimatedBorder(numberOfLines);
    useBackHandler(props.textInputRef);

    const CustomKeyboardButton = props.customKeyboardButton;

    return (
        <>
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundPrimary}
            >
                <Shortcuts shortcuts={props.shortcuts} />
                <Animated.View
                    style={[
                        styles.border,
                        {
                            backgroundColor: theme[ColorVariants.LineSecondary],
                            opacity: borderOpacity,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.container,
                        props.menuPlus?.length && props.menuPlus?.length > 0
                            ? null
                            : UIStyle.margin.leftDefault(),
                    ]}
                >
                    <MenuPlus
                        menuPlus={props.menuPlus}
                        menuPlusDisabled={props.menuPlusDisabled}
                    />
                    <View style={styles.inputMsg}>
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
                                placeholder={
                                    props.placeholder ?? uiLocalized.TypeMessage
                                }
                                onContentSizeChange={onContentSizeChange}
                                onChange={onChange}
                                onChangeText={onChangeText}
                                onKeyPress={onKeyPress}
                                onFocus={props.onFocus}
                                onBlur={props.onBlur}
                                style={inputStyle}
                            />
                        )}
                    </View>
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
                </View>
            </UIBackgroundView>
            <ChatPicker
                ref={props.pickerRef}
                onSendDocument={props.onSendDocument}
                onSendMedia={props.onSendMedia}
            />
        </>
    );
}
const styles = StyleSheet.create({
    // If you want to use flex: 1 see container!
    container: {
        // Do not use `flex: 1` on any View wrappers that should be
        // of size of their children, ie intrinsic.
        // On Android it could break layout, as with `flex: 1` height is collapsed
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    border: {
        height: 1,
    },
    inputMsg: {
        flex: 1,
        marginVertical: 0,
        paddingBottom: Platform.select({
            // compensate mobile textContainer's default padding
            android: 14,
            default: 17,
        }),
        paddingTop: 10,
    },
});
