import * as React from 'react';
import type Animated from 'react-native-reanimated';

let uidCounter = 0;

function makeMutableBottom(uid: number): Animated.SharedValue<number> {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return global.__uikitKeyboard.addFrameListener(uid);
}

function clearMutableBottom(uid: number) {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    global.__uikitKeyboard.removeFrameListener(uid);
}

export function useKeyboardBottomInset() {
    // TODO: should it be 0 or insets.bottom?
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
