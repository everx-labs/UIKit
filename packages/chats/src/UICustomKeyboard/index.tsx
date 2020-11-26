// @flow
import * as React from 'react';
import { Keyboard, Platform, View } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import {
    KeyboardAccessoryView,
    KeyboardRegistry,
    KeyboardUtils,
} from 'react-native-ui-lib/keyboard';
import type { KeyboardAccessoryViewProps } from 'react-native-ui-lib/keyboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIStyle, UIColor } from '@tonlabs/uikit.core';
import { useTheme } from '../useTheme';
import type { OnContentBottomInsetUpdate } from '../UIChatInput/types';

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

type Props = KeyboardAccessoryViewProps & {
    onContentBottomInsetUpdate?: OnContentBottomInsetUpdate;
};

export function UICustomKeyboard(props: Props) {
    if (Platform.OS === 'web') {
        // Do nothing
        return <View />;
    }

    const theme = useTheme();
    const insets = useSafeAreaInsets();

    // Keyboard
    const inputHeight = React.useRef<number>(0);
    const keyboardHeight = React.useRef<number>(0);

    const keyboardWillShowListener = React.useRef<EmitterSubscription>();
    const keyboardWillHideListener = React.useRef<EmitterSubscription>();

    const updateContentBottomInset = async () => {
        const bottomInset = keyboardHeight.current
            ? keyboardHeight.current - insets.bottom
            : inputHeight.current;

        if (props.onContentBottomInsetUpdate) {
            props.onContentBottomInsetUpdate(bottomInset);
        }
    };

    const onKeyboardShow = async (e: any) => {
        const { height } = e.endCoordinates;
        // N.B. `<` sign is important! (do not set `!==`)
        if (keyboardHeight.current < height) {
            keyboardHeight.current = height;

            updateContentBottomInset();
        }
    };

    const onKeyboardHide = async () => {
        if (keyboardHeight.current !== 0) {
            keyboardHeight.current = 0;

            updateContentBottomInset();
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

    // Events
    const onLayout = (e: any) => {
        const { nativeEvent } = e;
        if (nativeEvent) {
            const { layout } = nativeEvent;
            if (inputHeight.current !== layout.height) {
                inputHeight.current = layout.height;

                updateContentBottomInset();
            }
        }
    };

    return (
        <KeyboardAccessoryView
            key={`UICustomKeyboard:${trackingViewReady.toString()}`}
            useSafeArea={false}
            addBottomView={false}
            manageScrollView={false}
            allowHitsOutsideBounds
            revealKeyboardInteractive
            {...props}
            renderContent={() =>
                Platform.OS !== 'ios' ? (
                    props.renderContent()
                ) : (
                    <View
                        style={{
                            position: 'relative',
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        onLayout={onLayout}
                    >
                        {props.renderContent()}
                        <View // A dummy view to make SafeArea translates look nicer
                            style={[
                                { height: insets?.bottom ?? 0, top: '100%' },
                                UIStyle.container.absoluteFillWidth(),
                                UIStyle.color.getBackgroundColorStyle(
                                    UIColor.backgroundPrimary(theme)
                                ),
                            ]}
                        />
                    </View>
                )
            }
            onKeyboardResigned={props.onKeyboardResigned}
        />
    );
}
