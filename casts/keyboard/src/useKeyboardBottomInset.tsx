import * as React from 'react';
import { NativeModules } from 'react-native';
import type Animated from 'react-native-reanimated';

let uidCounter = 0;

function getUIKitKeyboardModule(): {
    addFrameListener: (uid: number) => Animated.SharedValue<number>;
    removeFrameListener: (uid: number) => void;
} {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    if (global.__uikitKeyboard == null) {
        NativeModules.UIKitKeyboardFrameListenerModule?.install();
    }
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return global.__uikitKeyboard;
}

function makeMutableBottom(uid: number) {
    return getUIKitKeyboardModule().addFrameListener(uid);
}

function clearMutableBottom(uid: number) {
    getUIKitKeyboardModule().removeFrameListener(uid);
}

export function useKeyboardBottomInset() {
    const uidRef = React.useRef<number>(0);
    if (uidRef.current === 0) {
        uidCounter += 1;
        uidRef.current = uidCounter;
    }
    const bottomRef = React.useRef<Animated.SharedValue<number>>();
    if (bottomRef.current == null) {
        bottomRef.current = makeMutableBottom(uidRef.current);
    }

    React.useEffect(() => {
        return () => {
            clearMutableBottom(uidRef.current);
        };
    }, [uidRef]);

    return bottomRef.current;
}
