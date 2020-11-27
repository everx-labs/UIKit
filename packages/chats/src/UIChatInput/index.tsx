import * as React from 'react';
import { Keyboard, Platform, TextInput } from 'react-native';

import { UICustomKeyboard, UICustomKeyboardUtils } from '../UICustomKeyboard';
import {
    OnPickSticker,
    UIStickerPackage,
    UIStickerPicker,
    UIStickerPickerRef,
    PickedSticker,
    UIStickerPickerKeyboardName,
} from '../UIStickerPicker';

import { ChatInput } from './ChatInput';
import type {
    OnHeightChange,
    OnSendText,
    OnSendMedia,
    OnSendDocument,
} from './types';
import type { ChatPickerRef } from './ChatPicker';

const AndroidKeyboardAdjust =
    Platform.OS === 'android'
        ? require('react-native-android-keyboard-adjust')
        : null;

export type OnStickersVisible = (visible: boolean) => void | Promise<void>;

function useStickers(
    onStickersVisible?: OnStickersVisible,
    onSendSticker?: OnPickSticker
) {
    const stickersPickerRef = React.useRef<UIStickerPickerRef>(null);
    const [stickersVisible, setStickersVisible] = React.useState<boolean>(
        false
    );

    const onStickersPress = React.useCallback(async () => {
        if (AndroidKeyboardAdjust) {
            // Apply a hack for Android animation
            AndroidKeyboardAdjust.setAdjustNothing();
            // N.B. It will change back to resize automatically once UICustomKeyboard is dismissed!
        }

        if (stickersVisible) {
            stickersPickerRef.current?.hide();
            if (Platform.OS !== 'web') {
                UICustomKeyboardUtils.dismiss();
            }
        } else {
            stickersPickerRef.current?.show();
            if (Platform.OS !== 'web') {
                Keyboard.dismiss();
            }
        }

        setStickersVisible(!stickersVisible);

        if (onStickersVisible) {
            onStickersVisible(!stickersVisible);
        }
    }, [stickersVisible]);

    const onFocus = React.useCallback(() => {
        stickersPickerRef.current?.hide();

        if (Platform.OS === 'android') {
            setTimeout(() => {
                setStickersVisible(false);
            }, 0); // required to fix an issue with the keyboard animation
        } else {
            setStickersVisible(false);
        }

        if (onStickersVisible) {
            onStickersVisible(false);
        }

        if (Platform.OS !== 'android') {
            return;
        }

        if (!stickersVisible && AndroidKeyboardAdjust) {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }, [stickersVisible]);

    const onBlur = React.useCallback(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        if (!stickersVisible) {
            UICustomKeyboardUtils.dismiss();
        } else {
            // This is not a likely case that stickers are visible on blur, but we need to ensure!
            // eslint-disable-next-line no-lonely-if
            if (AndroidKeyboardAdjust) {
                AndroidKeyboardAdjust.setAdjustResize();
            }
        }
    }, [stickersVisible]);

    const onKeyboardResigned = React.useCallback(() => {
        setStickersVisible(false);
    }, []);

    const onPickSticker = React.useCallback(
        (sticker: PickedSticker) => {
            onStickersPress();

            if (onSendSticker) {
                onSendSticker(sticker);
            }
        },
        [onStickersPress]
    );

    return {
        stickersPickerRef,
        stickersVisible,
        onStickersPress,
        onKeyboardResigned,
        onFocus,
        onBlur,
        onPickSticker,
    };
}

function useMenuPlus() {
    const chatPickerRef = React.useRef<ChatPickerRef>(null);
    const onPressImage = () => {
        chatPickerRef.current?.openImageDialog();
    };
    const onPressDocument = () => {
        chatPickerRef.current?.openDocumentDialog();
    };

    const menu = [
        {
            title: 'Attach image',
            onPress: onPressImage,
        },
        {
            title: 'Attach document',
            onPress: onPressDocument,
        },
    ];

    return {
        menuPlus: menu,
        chatPickerRef,
    };
}

type Props = {
    editable: boolean; // TODO
    placeholder?: string;
    stickers: UIStickerPackage[];
    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onSendSticker: OnPickSticker;
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;
};

export const UIChatInput = React.forwardRef<null, Props>(
    function UIChatInputInternal(props, ref) {
        const textInputRef = React.useRef<TextInput>(null);
        const {
            stickersPickerRef,
            stickersVisible,
            onStickersPress,
            onKeyboardResigned,
            onFocus,
            onBlur,
            onPickSticker,
        } = useStickers(props.onStickersVisible);
        const { menuPlus, chatPickerRef } = useMenuPlus();

        const input = (
            <ChatInput
                ref={ref}
                editable={props.editable}
                placeholder={props.placeholder}
                textInputRef={textInputRef}
                pickerRef={chatPickerRef}
                stickersVisible={stickersVisible}
                onSendText={props.onSendText}
                onSendMedia={props.onSendMedia}
                onSendDocument={props.onSendDocument}
                onStickersPress={onStickersPress}
                onHeightChange={
                    Platform.OS === 'web' ? props.onHeightChange : undefined
                }
                menuPlus={menuPlus}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        );

        if (Platform.OS === 'web') {
            return (
                <>
                    {input}
                    <UIStickerPicker
                        ref={stickersPickerRef}
                        stickers={props.stickers}
                        onPick={onPickSticker}
                    />
                </>
            );
        }

        return (
            <UICustomKeyboard
                renderContent={() => input}
                kbInputRef={textInputRef}
                kbComponent={
                    stickersVisible ? UIStickerPickerKeyboardName : undefined
                    // UIStickerPickerKeyboardName
                }
                kbInitialProps={{
                    ref: stickersPickerRef,
                    // The following doesn't work for iOS, thus we use `onItemSelected` prop
                    onPick: onPickSticker,
                    isCustomKeyboard: true,
                    stickers: props.stickers,
                }}
                onItemSelected={(_id, stk) => onPickSticker(stk)}
                onKeyboardResigned={onKeyboardResigned}
                onHeightChange={props.onHeightChange}
            />
        );
    }
);
