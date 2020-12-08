import * as React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TextInput,
    BackHandler,
    Animated,
} from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    UITextView,
    useUITextViewValue,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import { UICustomKeyboardUtils } from '../UICustomKeyboard';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickActions';
import { StickersButton } from './StickerButton';
import type { OnStickersPress } from './StickerButton';
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
    setDefaultInputHeight,
}: {
    ref: React.RefObject<TextInput>;
    onSendText: OnSendText;
    showMaxLengthAlert: () => void;
    setDefaultInputHeight: () => void;
}) {
    const {
        inputHasValue,
        inputValue,
        wasClearedWithEnter,
        clear,
        onChangeText: onBaseChangeText,
        onKeyPress: onBaseKeyPress,
    } = useUITextViewValue(ref, true);

    const onSendText = React.useCallback(() => {
        if (onSendTextProp) {
            onSendTextProp(inputValue.current);
        }

        clear();
        setDefaultInputHeight();
    }, []);

    const onChangeText = React.useCallback(
        (text: string) => {
            onBaseChangeText(text);

            if (text.length >= MAX_INPUT_LENGTH) {
                showMaxLengthAlert();
            }
        },
        [inputHasValue],
    );

    const onKeyPress = React.useCallback((e: any) => {
        // Enable only for web (in native e.key is undefined)
        onBaseKeyPress(e);

        if (wasClearedWithEnter.current) {
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
    }, []);

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

function useInputAdjustHeight(onHeightChange?: OnHeightChange) {
    const [inputHeight, setInputHeight] = React.useState<number>(
        UIConstant.smallCellHeight(),
    );

    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (event && event.nativeEvent) {
                const { contentSize } = event.nativeEvent;
                const height = contentSize?.height || 0;

                if (height <= 0) {
                    return;
                }

                if (height === inputHeight) {
                    return;
                }

                if (onHeightChange) {
                    onHeightChange(height);
                }

                const constrainedHeight = Math.min(
                    height,
                    UIConstant.smallCellHeight() * CHAT_INPUT_NUM_OF_LINES,
                );
                setInputHeight(constrainedHeight);
            }
        },
        [inputHeight],
    );

    const setDefaultInputHeight = React.useCallback(() => {
        setInputHeight(UIConstant.smallCellHeight());
    }, []);

    // iOS and web input have the own multiline native auto-grow behaviour
    // No need to adjust the height
    const containerStyle =
        Platform.OS === 'android'
            ? {
                  height: Math.max(UIConstant.largeButtonHeight(), inputHeight),
              }
            : null;

    const numberOfLines =
        Platform.OS === 'android'
            ? CHAT_INPUT_NUM_OF_LINES
            : Math.round(inputHeight / UIConstant.smallCellHeight());

    return {
        onContentSizeChange,
        setDefaultInputHeight,
        containerStyle,
        numberOfLines,
    };
}

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
    }, [numberOfLines]);

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

    stickersVisible: boolean;

    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onStickersPress: OnStickersPress;
    onHeightChange?: OnHeightChange;
    onFocus: () => void;
    onBlur: () => void;
};

export function ChatInput(props: Props) {
    const theme = useTheme();

    const {
        containerStyle,
        numberOfLines,
        onContentSizeChange,
        setDefaultInputHeight,
    } = useInputAdjustHeight(props.onHeightChange);
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
        setDefaultInputHeight,
    });
    const borderOpacity = useAnimatedBorder(numberOfLines);
    useBackHandler(props.textInputRef);

    return (
        <>
            <View
                style={[
                    UIStyle.color.getBackgroundColorStyle(
                        theme[ColorVariants.BackgroundPrimary],
                    ),
                    containerStyle,
                ]}
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
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
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
                                    numberOfLines={numberOfLines}
                                    placeholder={
                                        props.placeholder ??
                                        uiLocalized.TypeMessage
                                    }
                                    onContentSizeChange={onContentSizeChange}
                                    onChangeText={onChangeText}
                                    onKeyPress={onKeyPress}
                                    onFocus={props.onFocus}
                                    onBlur={props.onBlur}
                                    style={styles.input}
                                />
                            </View>
                        )}
                    </View>
                    <StickersButton
                        hasStickers={props.editable}
                        stickersVisible={props.stickersVisible}
                        inputHasValue={inputHasValue}
                        onPress={props.onStickersPress}
                    />
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
            </View>
            <ChatPicker
                ref={props.pickerRef}
                onSendDocument={props.onSendDocument}
                onSendMedia={props.onSendMedia}
            />
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
            android: 10,
            ios: 17,
            web: 15,
        }),
        paddingTop: 10,
    },
    input: {
        padding: 0,
        maxHeight: UIConstant.chatInputMaxHeight(),
        // We remove the fontFamily for Android in order to eliminate jumping input behaviour
        ...(Platform.OS === 'android' ? { fontFamily: undefined } : null),
        ...{
            marginTop:
                Platform.OS === 'ios' && process.env.NODE_ENV === 'production'
                    ? 5 // seems to be smth connected to iOS's textContainerInset
                    : 0,
        },
    },
});
