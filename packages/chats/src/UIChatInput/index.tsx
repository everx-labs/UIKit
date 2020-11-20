import * as React from 'react';
import { Platform } from 'react-native';

// import { ChatPicker } from './ChatPicker';
import { ChatInput } from './ChatInput';

const AndroidKeyboardAdjust =
    Platform.OS === 'android'
        ? require('react-native-android-keyboard-adjust')
        : null;

type PickedSticker = {
    // TODO
};

type UIStickerPackage = {
    // TODO
};

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
        setStickersVisible(options.show);
    }

    if (onStickersVisible) {
        onStickersVisible(options.show);
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
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
};

export const UIChatInput = React.forwardRef(function UIChatInputInternal(
    props: Props,
    ref
) {
    const onSendSticker = React.useCallback((sticker: PickedSticker) => {
        if (props.onSendSticker) {
            props.onSendSticker(sticker);
        }
    }, []);
    const [stickersVisible, setStickersVisible] = React.useState<boolean>(
        false
    );
    const [stickers, setStickers] = React.useState<UIStickerPackage[]>([]);

    if (Platform.OS === 'web') {
        return (
            <>
                <ChatInput
                    ref={ref}
                    editable={true /*TODO*/}
                    stickersVisible={stickersVisible}
                    onSendText={(t) => {
                        console.log(t)
                    }}
                    onStickersPress={() => {
                        // onStickersPress({
                        //     show: !stickersVisible,
                        //     dismiss: stickersVisible,
                        //     stickersVisible,
                        //     setStickersVisible,
                        //     onStickersVisible: props.onStickersVisible,
                        // });
                    }}
                    
                    {...props}
                />
                {/* <UIStickerPicker
                    stickers={null /*TODO}
                    onPickSticker={onSendSticker}
                /> */}
            </>
        );
    }

    return (
        <UICustomKeyboard
            renderContent={renderInput}
            kbInputRef={textInputRef}
            kbComponent={
                stickersVisible ? UIStickerPicker.keyboardName : undefined
            }
            kbInitialProps={{
                onPickSticker: onSendSticker,
                isCustomKeyboard: true,
                stickers,
            }}
            onItemSelected={(_kbID, sticker) => {
                onSendSticker(sticker);
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
});
