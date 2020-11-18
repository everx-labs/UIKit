// @flow
/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardTrackingView } from 'react-native-ui-lib/keyboard';

import { UIColor, UIConstant, UIDevice, UIStyle } from '@ttonlabs/uikit.core';

let trackingViewIsReady: boolean = false; // global flag to learn if KeyboardTrackingView usable

const UIKeyboardAccessory = ({
    children,
    onContentBottomInsetUpdate,
    disableTrackingView = false,
    customKeyboardVisible = false,
}: {
    children: React$Element<any>;
    onContentBottomInsetUpdate: (bottom: number) => void;
    disableTrackingView?: boolean;
    customKeyboardVisible?: boolean;
}) => {
    if (Platform.OS !== 'ios') {
        // In spite of a condition rendering, it's not a dynamic condition.
        // Thus it can be safely used with the next coming hooks.
        return children;
    }

    // Safe Area
    const translateY = useRef<Animated.Value>(new Animated.Value(0));

    const translateSafeArea = async (translate: boolean) => {
        Animated.timing(translateY.current, {
            toValue: translate ? (await UIDevice.safeAreaInsets()).bottom : 0,
            duration: UIConstant.animationSmallDuration(),
            easing: Easing.inOut(Easing.ease),
        }).start();
    };

    // Keyboard
    const customKeyboardVisibleRef = useRef<boolean>(false);
    customKeyboardVisibleRef.current = customKeyboardVisible;

    const inputHeight = useRef<number>(0);
    const keyboardHeight = useRef<number>(0);

    const keyboardWillShowListener = useRef();
    const keyboardWillHideListener = useRef();

    const updateContentBottomInset = async () => {
        const bottomInset = keyboardHeight.current
            ? keyboardHeight.current - (await UIDevice.safeAreaInsets()).bottom
            : inputHeight.current;
        if (onContentBottomInsetUpdate) {
            onContentBottomInsetUpdate(bottomInset);
        }
    };

    const onKeyboardShow = async (e: any) => {
        const { height } = e.endCoordinates;
        if (
            keyboardHeight.current < height && // N.B. `<` sign is important! (do not set `!==`)
            inputHeight.current < height // N.B.2 Ensure it is not triggered without hardware kb
        ) {
            keyboardHeight.current =
                height +
                // When showing a content from UICustomKeyboard,
                // it doesn't calculate the keyboardHeight properly.
                (customKeyboardVisibleRef.current ? inputHeight.current : 0);

            updateContentBottomInset();
            translateSafeArea(true);
        }
    };

    const onKeyboardHide = async () => {
        if (keyboardHeight.current !== 0) {
            keyboardHeight.current = 0;

            updateContentBottomInset();
            translateSafeArea(false);
        }
    };

    const initKeyboardListeners = () => {
        keyboardWillShowListener.current = Keyboard.addListener(
            'keyboardWillShow',
            onKeyboardShow
        );

        keyboardWillHideListener.current = Keyboard.addListener(
            'keyboardWillHide',
            onKeyboardHide
        );
    };

    const deinitKeyboardListeners = () => {
        if (keyboardWillHideListener.current) {
            keyboardWillHideListener.current.remove();
        }

        if (keyboardWillShowListener.current) {
            keyboardWillShowListener.current.remove();
        }
    };

    // Tracking View Ready Hack
    const [trackingViewReady, setTrackingViewReady] = useState<boolean>(
        trackingViewIsReady
    );

    const makeKeyboardTrackingReady = () => {
        if (disableTrackingView || trackingViewIsReady) {
            return;
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
    useEffect(() => {
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

    const Wrapper = disableTrackingView ? View : KeyboardTrackingView;

    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <Animated.View
                    onLayout={onLayout}
                    style={{
                        // Next is required to keep the height relevant for custom keyboard wrapper
                        position: disableTrackingView ? 'relative' : 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        transform: [
                            {
                                translateY: translateY.current,
                            },
                        ],
                    }}
                >
                    <Wrapper
                        key={`UIKeyboardAccessory:${trackingViewReady.toString()}`}
                    >
                        {children}
                        <View>
                            <View // A dummy view to make SafeArea translates look nicer
                                style={[
                                    { height: insets.bottom },
                                    UIStyle.container.absoluteFillWidth(),
                                    UIStyle.color.getBackgroundColorStyle(
                                        UIColor.backgroundPrimary()
                                    ),
                                ]}
                            />
                        </View>
                    </Wrapper>
                </Animated.View>
            )}
        </SafeAreaInsetsContext.Consumer>
    );
};

export default UIKeyboardAccessory;
