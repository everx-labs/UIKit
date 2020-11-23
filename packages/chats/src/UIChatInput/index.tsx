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

        setStickersVisible(!stickersVisible);

        if (onStickersVisible) {
            onStickersVisible(!stickersVisible);
        }
    };

    return {
        stickersPickerRef,
        stickersVisible,
        onStickersPress,
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

export const UIChatInput = React.forwardRef<null, Props>(
    function UIChatInputInternal(props, ref) {
        const textInputRef = React.useRef<TextInput>(null);
        const {
            stickersPickerRef,
            stickersVisible,
            onStickersPress,
        } = useStickers(props.onStickersVisible);

        const input = (
            <ChatInput
                ref={ref}
                textInputRef={textInputRef}
                editable={props.editable}
                stickersVisible={stickersVisible}
                onSendText={props.onSendText}
                onSendMedia={props.onSendMedia}
                onSendDocument={props.onSendDocument}
                onStickersPress={onStickersPress}
                onHeightChange={props.onHeightChange}
                onContentBottomInsetUpdate={props.onContentBottomInsetUpdate}
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

        if (!props.onSendSticker) {
            return input;
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
                    onPick: props.onSendSticker,
                    isCustomKeyboard: true,
                    stickers: props.stickers,
                }}
                onItemSelected={(_kbID, sticker: PickedSticker) => {
                    onStickersPress();
                    props.onSendSticker(sticker);
                }}
                // onKeyboardResigned={() => {}}
            />
        );
    }
);
