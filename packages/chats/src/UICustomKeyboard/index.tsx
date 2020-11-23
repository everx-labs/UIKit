// @flow
import * as React from 'react';
import { Keyboard, Platform, View, TextInput } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import {
    KeyboardAccessoryView,
    KeyboardRegistry,
    KeyboardUtils,
} from 'react-native-ui-lib/keyboard';
import type { KeyboardAccessoryViewProps } from 'react-native-ui-lib/keyboard';

const registerCustomKeyboard = (
    kbID: string,
    component: React.ReactNode,
    props?: { [key: string]: any }
) => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    const params = { ...props, kbComponent: kbID };
    KeyboardRegistry.registerKeyboard(kbID, () => component, params);
};

const onItemSelected = (kbID: string, selectedItem: any) => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    KeyboardRegistry.onItemSelected(kbID, selectedItem);
};

const dismiss = () => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    KeyboardUtils.dismiss();
};

export const UICustomKeyboardUtils = {
    registerCustomKeyboard,
    onItemSelected,
    dismiss,
};

let trackingViewIsReady: boolean = false; // global flag to learn if KeyboardTrackingView usable

export function UICustomKeyboard(props: KeyboardAccessoryViewProps) {
    if (Platform.OS === 'web') {
        // Do nothing
        return <View />;
    }

    // Keyboard
    const keyboardHeight = React.useRef<number>(0);

    const keyboardWillShowListener = React.useRef<EmitterSubscription>();
    const keyboardWillHideListener = React.useRef<EmitterSubscription>();

    const onKeyboardShow = async (e: any) => {
        const { height } = e.endCoordinates;
        if (keyboardHeight.current < height) {
            // N.B. `<` sign is important! (do not set `!==`)
            keyboardHeight.current = height;
        }
    };

    const onKeyboardHide = async () => {
        if (keyboardHeight.current !== 0) {
            keyboardHeight.current = 0;
        }
    };

    const initKeyboardListeners = () => {
        if (Platform.OS === 'web') {
            return;
        }

        keyboardWillShowListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            onKeyboardShow
        );

        keyboardWillHideListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            onKeyboardHide
        );
    };

    const deinitKeyboardListeners = () => {
        if (Platform.OS === 'web') {
            return;
        }

        if (keyboardWillHideListener.current) {
            keyboardWillHideListener.current.remove();
        }

        if (keyboardWillShowListener.current) {
            keyboardWillShowListener.current.remove();
        }
    };

    // Tracking View Ready Hack
    const [trackingViewReady, setTrackingViewReady] = React.useState<boolean>(
        trackingViewIsReady
    );

    const makeKeyboardTrackingReady = () => {
        if (Platform.OS !== 'ios' || trackingViewIsReady) {
            return; // no need
        }

        trackingViewIsReady = true;

        // We are to re-render the keyboard tracking view once mounted.
        // This looks like a hack to make it work, and it actually is! :)
        setTimeout(() => {
            // Now re-render
            setTrackingViewReady(trackingViewIsReady);
        }, 1000); // wait for a sec
    };

    // Life-cycle
    React.useEffect(() => {
        // Did mount
        initKeyboardListeners();
        // KeyboardTrackingView might be not ready. Need to re-render if so.
        makeKeyboardTrackingReady();
        // Will unmount
        return deinitKeyboardListeners;
    }, []);

    return (
        <KeyboardAccessoryView
            key={`UICustomKeyboard:${trackingViewReady.toString()}`}
            useSafeArea={false}
            addBottomView={true} // TODO: is it only way?
            manageScrollView={false}
            allowHitsOutsideBounds
            revealKeyboardInteractive
            {...props}
            onKeyboardResigned={props.onKeyboardResigned}
        />
    );
}
