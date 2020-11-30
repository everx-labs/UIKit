import * as React from 'react';
import { Keyboard, Platform, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { UICustomKeyboard, UICustomKeyboardUtils } from '../UICustomKeyboard';
import {
    UIStickerPicker,
    UIStickerPickerRef,
    UIStickerPickerKeyboardName,
} from '../UIStickerPicker';

import { ChatInput } from './ChatInput';
import type {
    OnHeightChange,
    OnSendText,
    OnSendMedia,
    OnSendDocument,
    Shortcut,
    MenuItem,
    QuickActionItem,
} from './types';
import type { ChatPickerRef } from './ChatPicker';
import type { OnPickSticker, PickedSticker, UIStickerPackage } from '../types';

const AndroidKeyboardAdjust =
    Platform.OS === 'android'
        ? require('react-native-android-keyboard-adjust')
        : null;

export type OnStickersVisible = (visible: boolean) => void | Promise<void>;

function useStickers(
    onStickersVisible?: OnStickersVisible,
    onSendSticker?: OnPickSticker,
) {
    const stickersPickerRef = React.useRef<UIStickerPickerRef>(null);
    const [stickersVisible, setStickersVisible] = React.useState<boolean>(
        false,
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
        [onStickersPress],
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

function useMenuPlus(menuPlusHidden: boolean = false) {
    const chatPickerRef = React.useRef<ChatPickerRef>(null);
    const onPressImage = () => {
        chatPickerRef.current?.openImageDialog();
    };
    const onPressDocument = () => {
        chatPickerRef.current?.openDocumentDialog();
    };

    const menu: MenuItem[] = menuPlusHidden
        ? []
        : [
            {
                title: uiLocalized.Chats.Actions.AttachImage,
                onPress: onPressImage,
            },
            {
                title: uiLocalized.Chats.Actions.AttachDocument,
                onPress: onPressDocument,
            },
        ];

    return {
        menuPlus: menu,
        chatPickerRef,
    };
}

type Props = {
    editable: boolean;
    placeholder?: string;
    stickers?: UIStickerPackage[];
    shortcuts?: Shortcut[];
    menuPlusHidden?: boolean;
    menuPlusDisabled?: boolean;
    menuMoreDisabled?: boolean;
    quickActions?: QuickActionItem[];
    // TODO: revisit how it should work after it'll be integrated to Surf
    inputHidden?: boolean;

    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onSendSticker: OnPickSticker;
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;
};

export function UIChatInput(props: Props) {
    const textInputRef = React.useRef<TextInput>(null);
    const {
        stickersPickerRef,
        stickersVisible,
        onStickersPress,
        onKeyboardResigned,
        onFocus,
        onBlur,
        onPickSticker,
    } = useStickers(props.onStickersVisible, props.onSendSticker);
    const { menuPlus, chatPickerRef } = useMenuPlus(props.menuPlusHidden);

    const input = (
        <ChatInput
            editable={props.editable}
            placeholder={props.placeholder}
            shortcuts={props.shortcuts}
            menuPlus={menuPlus}
            menuPlusDisabled={props.menuPlusDisabled}
            menuMore={
                undefined /* TODO: we not render it right now, but could at some point */
            }
            menuMoreDisabled={props.menuPlusDisabled}
            inputHidden={props.inputHidden}
            quickActions={props.quickActions}
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
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );

    if (Platform.OS === 'web') {
        return (
            <>
                {input}
                {props.stickers && (
                    <UIStickerPicker
                        ref={stickersPickerRef}
                        stickers={props.stickers}
                        onPick={onPickSticker}
                    />
                )}
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
