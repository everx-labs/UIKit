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

// import { ChatPicker } from './ChatPicker';
import { ChatInput } from './ChatInput';
import type {
    OnHeightChange,
    OnContentBottomInsetUpdate,
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

function useStickers(onStickersVisible?: OnStickersVisible) {
    const stickersPickerRef = React.useRef<UIStickerPickerRef>(null);
    const [stickersVisible, setStickersVisible] = React.useState<boolean>(
        false
    );

    const onStickersPress = () => {
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

        if (Platform.OS === 'android') {
            setTimeout(() => {
                setStickersVisible(!stickersVisible);
            }, 0); // required to fix an issue with the keyboard animation
        } else {
            setStickersVisible(!stickersVisible);
        }

        if (onStickersVisible) {
            onStickersVisible(!stickersVisible);
        }
    };

    const onFocus = () => {
        // stickersPickerRef.current?.hide();
        // if (Platform.OS !== 'web') {
        //     UICustomKeyboardUtils.dismiss();
        // }

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
    };

    const onBlur = () => {
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
    };

    const onKeyboardResigned = () => {
        setStickersVisible(false);
    };

    return {
        stickersPickerRef,
        stickersVisible,
        onStickersPress,
        onKeyboardResigned,
        onFocus,
        onBlur,
    };
}

type Props = {
    editable: boolean; // TODO
    stickers: UIStickerPackage[];
    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onSendSticker: OnPickSticker;
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
    onHeightChange?: OnHeightChange;
    onContentBottomInsetUpdate?: OnContentBottomInsetUpdate;
};

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
        } = useStickers(props.onStickersVisible);
        const { menuPlus, chatPickerRef } = useMenuPlus();

        const input = (
            <ChatInput
                ref={ref}
                textInputRef={textInputRef}
                pickerRef={chatPickerRef}
                editable={props.editable}
                stickersVisible={stickersVisible}
                onSendText={props.onSendText}
                onSendMedia={props.onSendMedia}
                onSendDocument={props.onSendDocument}
                onStickersPress={onStickersPress}
                onHeightChange={props.onHeightChange}
                onContentBottomInsetUpdate={props.onContentBottomInsetUpdate}
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
                        onPick={props.onSendSticker}
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
                }
                kbInitialProps={{
                    ref: stickersPickerRef,
                    // The following doesn't work for iOS, thus we use `onItemSelected` prop
                    onPick: props.onSendSticker,
                    isCustomKeyboard: true,
                    stickers: props.stickers,
                }}
                onItemSelected={(_kbID, sticker: PickedSticker) => {
                    onStickersPress();
                    props.onSendSticker(sticker);
                }}
                onKeyboardResigned={onKeyboardResigned}
            />
        );
    }
);
