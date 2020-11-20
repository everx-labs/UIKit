import * as React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TextInput,
    BackHandler,
    Animated,
} from 'react-native';

import { UIConstant, UIColor, UIStyle } from '@tonlabs/uikit.core';
import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIKeyboardAccessory } from '../UIKeyboardAccessory';
import { UICustomKeyboardUtils } from '../UICustomKeyboard';
import { useTheme } from '../useTheme';

import { MenuPlus } from './MenuPlus';
import { MenuMore } from './MenuMore';
import { QuickAction } from './QuickAction';
import { StickersButton } from './StickerButton';
import type { OnStickersPress } from './StickerButton';
import type {
    MenuItem,
    QuickActionItem,
    OnSendText,
    OnSendMedia,
    OnSendDocument,
    OnContentBottomInsetUpdate,
    OnHeightChange,
} from './types';

const MAX_INPUT_LENGTH = 320;

function useInputValue({
    onSendText: onSendTextProp,
    showMaxLengthAlert,
    setDefaultInputHeight,
}: {
    onSendText: OnSendText;
    showMaxLengthAlert: () => void;
    setDefaultInputHeight: () => void;
}) {
    const inputRef = React.useRef<TextInput | null>(null);
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
        setDefaultInputHeight();
    }, []);

    const onChangeText = React.useCallback(
        (text: string) => {
            // It could be that we sent a message with "Enter" from keyboard
            // But the event with newline is fired after this
            // So, to prevent setting it, need to check a flag
            // And also check that input string is a newline
            if (wasClearedWithEnter.current && text === '\n') {
                wasClearedWithEnter.current = false;
                return;
            }

            inputValue.current = text;

            const hasValue = text != null ? text.length > 0 : false;

            if (hasValue !== inputHasValue) {
                setInputHasValue(hasValue);
            }

            if (text.length >= MAX_INPUT_LENGTH) {
                showMaxLengthAlert();
            }
        },
        [inputHasValue]
    );

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
    }, []);

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
    const [inputHeight, setInputHeight] = React.useState<number>(
        UIConstant.smallCellHeight()
    );

    const onContentSizeChange = React.useCallback((event: any) => {
        if (event && event.nativeEvent) {
            const { contentSize } = event.nativeEvent;
            const height = contentSize?.height || 0;

            if (height === inputHeight) {
                return;
            }
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

    const setDefaultInputHeight = React.useCallback(() => {
        setInputHeight(UIConstant.smallCellHeight());
    }, []);

    return {
        inputHeight,
        onContentSizeChange,
        setDefaultInputHeight,
    };
}

function useBackHandler(ref: React.RefObject<TextInput | undefined>) {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (ref.current && ref.current.isFocused()) {
                    UICustomKeyboardUtils.dismiss();
                    return true;
                }
                return false;
            }
        );

        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, []);
}

type Ref = {
    showBorder: (show: boolean) => void;
};

function useAnimatedBorder(ref: React.Ref<Ref> | null) {
    const borderOpacity = React.useRef<Animated.Value>(new Animated.Value(0))
        .current;

    React.useImperativeHandle(ref, () => ({
        showBorder: (show: boolean) => {
            Animated.spring(borderOpacity, {
                toValue: show ? 1 : 0,
                useNativeDriver: true,
                speed: 20,
            }).start();
        },
    }));

    return borderOpacity;
}

type Props = {
    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
    quickAction?: QuickActionItem[];

    editable: boolean;
    inputHidden?: boolean; // TODO: what is it?
    stickersVisible: boolean;

    // TODO: do we need separate handlers for different content type?
    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onStickersPress: OnStickersPress;
    // TODO: can we not expose it?
    onHeightChange?: OnHeightChange;
    onContentBottomInsetUpdate?: OnContentBottomInsetUpdate;
};

export const ChatInput = React.forwardRef<Ref, Props>(
    function ChatInputForwarded(props, ref) {
        const theme = useTheme();

        const {
            inputHeight,
            onContentSizeChange,
            setDefaultInputHeight,
        } = useInputAdjustHeight(props.onHeightChange);
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
            setDefaultInputHeight,
        });
        const borderOpacity = useAnimatedBorder(ref);
        useBackHandler(inputRef);

        const pickerRef = React.useRef();

        return (
            <UIKeyboardAccessory
                onContentBottomInsetUpdate={props.onContentBottomInsetUpdate}
                customKeyboardVisible={props.stickersVisible}
                disableTrackingView // since the UICustomKeyboard is used!
            >
                <View
                    style={UIStyle.color.getBackgroundColorStyle(
                        UIColor.backgroundPrimary(theme)
                    )}
                >
                    {/* actionsView TODO: Make actions */}
                    <Animated.View
                        style={[styles.border, { opacity: borderOpacity }]}
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
                            <TextInput
                                ref={inputRef}
                                testID="chat_input"
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                keyboardType="default"
                                editable={props.editable}
                                maxLength={MAX_INPUT_LENGTH}
                                multiline={true}
                                numberOfLines={Math.round(
                                    inputHeight / UIConstant.smallCellHeight()
                                )}
                                // @ts-ignore
                                noPersonalizedLearning={false}
                                clearButtonMode="never"
                                placeholder={uiLocalized.TypeMessage}
                                placeholderTextColor={UIColor.textPlaceholder(
                                    theme
                                )}
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
                        <StickersButton
                            hasStickers={props.editable}
                            stickersVisible={props.stickersVisible}
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
                </View>
                {/* {!hideMenuPlus && (
                <ChatPicker
                    ref={pickerRef}
                    onSendDocument={props.onSendDocument}
                    onSendMedia={props.onSendMedia}
                />
            )} */}
            </UIKeyboardAccessory>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    border: {
        height: 1,
        backgroundColor: UIColor.grey1(),
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
