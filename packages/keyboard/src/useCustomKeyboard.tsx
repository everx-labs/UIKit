import * as React from 'react';
import { Keyboard, Platform } from 'react-native';

import { UICustomKeyboardUtils } from './UICustomKeyboard';

const AndroidKeyboardAdjust =
    Platform.OS === 'android'
        ? require('react-native-android-keyboard-adjust')
        : null;

export type OnCustomKeyboardVisible = (
    visible: boolean,
) => void | Promise<void>;

export function useCustomKeyboard(
    onCustomKeyboardVisible?: OnCustomKeyboardVisible,
    editable?: boolean,
) {
    const [customKeyboardVisible, setCustomKeyboardVisible] = React.useState<
        boolean
    >(false);

    const toggleKeyboard = React.useCallback(() => {
        if (AndroidKeyboardAdjust) {
            // Apply a hack for Android animation
            AndroidKeyboardAdjust.setAdjustNothing();
            // N.B. It will change back to resize automatically once UICustomKeyboard is dismissed!
        }

        if (Platform.OS !== 'web') {
            // Manage the keyboard as per the latest state
            if (customKeyboardVisible) {
                UICustomKeyboardUtils.dismiss();
            } else {
                Keyboard.dismiss();
            }
        }

        // Change the state
        const nextState = !!editable && !customKeyboardVisible;
        setCustomKeyboardVisible(nextState);

        // Trigger an event about the state change
        if (onCustomKeyboardVisible) {
            onCustomKeyboardVisible(nextState);
        }
    }, [editable, customKeyboardVisible]);

    const onFocus = React.useCallback(() => {
        if (Platform.OS === 'android') {
            setTimeout(() => {
                setCustomKeyboardVisible(false);
            }, 0); // required to fix an issue with the keyboard animation
        } else {
            setCustomKeyboardVisible(false);
        }

        if (onCustomKeyboardVisible) {
            onCustomKeyboardVisible(false);
        }

        if (Platform.OS !== 'android') {
            return;
        }

        if (!customKeyboardVisible && AndroidKeyboardAdjust) {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }, [customKeyboardVisible]);

    const onBlur = React.useCallback(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        if (!customKeyboardVisible) {
            UICustomKeyboardUtils.dismiss();
        } else {
            // This is not a likely case that stickers are visible on blur, but we need to ensure!
            // eslint-disable-next-line no-lonely-if
            if (AndroidKeyboardAdjust) {
                AndroidKeyboardAdjust.setAdjustResize();
            }
        }
    }, [customKeyboardVisible]);

    const onKeyboardResigned = React.useCallback(() => {
        setCustomKeyboardVisible(false);
    }, []);
    return {
        customKeyboardVisible: customKeyboardVisible && !!editable,
        toggleKeyboard,
        onKeyboardResigned,
        onFocus,
        onBlur,
    };
}
