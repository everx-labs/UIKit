import * as React from 'react';
import { Keyboard, Platform } from 'react-native';

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

type StickersPressOptions = {
    show: boolean;
    dismiss: boolean;
    stickersVisible: boolean;
    setStickersVisible: (visible: boolean) => void;
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
};

const onStickersPress = (options: StickersPressOptions) => {
    if (options.stickersVisible) {
        return;
    }

    if (AndroidKeyboardAdjust) {
        // Apply a hack for Android animation
        AndroidKeyboardAdjust.setAdjustNothing();
        // N.B. It will change back to resize automatically once UICustomKeyboard is dismissed!
    }

    if (Platform.OS === 'web') {
        // nothing
    } else if (options.show) {
        Keyboard.dismiss();
    } else if (options.dismiss) {
        UICustomKeyboardUtils.dismiss();
    }

    if (Platform.OS === 'android') {
        // nothing
    } else {
        options.setStickersVisible(options.show);
    }

    if (options.onStickersVisible) {
        options.onStickersVisible(options.show);
    }

    (async () => {
        if (options.show) {
            await UIStickerPicker.show();
        } else {
            await UIStickerPicker.show();
        }
    })();
};

type Props = {
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
        const stickersPickerRef = React.useRef<UIStickerPickerRef>(null);
        const [stickersVisible, setStickersVisible] = React.useState<boolean>(
            false
        );

        if (Platform.OS === 'web') {
            return (
                <>
                    <ChatInput
                        ref={ref}
                        editable={true /*TODO*/}
                        stickersVisible={stickersVisible}
                        onSendText={props.onSendText}
                        onSendMedia={props.onSendMedia}
                        onSendDocument={props.onSendDocument}
                        onStickersPress={() => {
                            // onStickersPress({
                            //     show: !stickersVisible,
                            //     dismiss: stickersVisible,
                            //     stickersVisible,
                            //     setStickersVisible,
                            //     onStickersVisible: props.onStickersVisible,
                            // });
                            if (stickersVisible) {
                                stickersPickerRef.current?.hide();
                            } else {
                                stickersPickerRef.current?.show();
                            }
                            setStickersVisible(!stickersVisible);
                        }}
                        onHeightChange={props.onHeightChange}
                        onContentBottomInsetUpdate={
                            props.onContentBottomInsetUpdate
                        }
                    />
                    <UIStickerPicker
                        ref={stickersPickerRef}
                        stickers={props.stickers}
                        onPick={props.onSendSticker}
                    />
                </>
            );
        }

        if (!props.onSendSticker) {
            return renderInput;
        }

        return (
            <UICustomKeyboard
                renderContent={renderInput}
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
                    props.onSendSticker(sticker);
                }}
                onKeyboardResigned={() => {
                    onStickersPress({
                        show: false,
                        dismiss: true,
                        stickersVisible,
                        setStickersVisible,
                        onStickersVisible: props.onStickersVisible,
                    });
                }}
            />
        );
    }
);
