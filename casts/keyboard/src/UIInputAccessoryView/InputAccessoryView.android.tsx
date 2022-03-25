import * as React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { UIBackgroundView } from '@tonlabs/uikit.themes';

import type { UIInputAccessoryViewProps } from './types';
import { useKeyboardBottomInset } from '../useKeyboardBottomInset';

const CustomKeyboardNativeView = requireNativeComponent<UIInputAccessoryViewProps>(
    'CustomKeyboardNativeView',
);

function InputAccessoryViewLike({ children }: { children: React.ReactNode }) {
    const { bottom: bottomInset } = useSafeAreaInsets();
    const keyboardBottomInset = useKeyboardBottomInset();

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: Math.min(-1 * (keyboardBottomInset.value - bottomInset), 0),
                },
            ],
        };
    });

    return (
        <Animated.View style={[styles.inputAccessoryLikeContainer, style]}>
            {children}
            <UIBackgroundView style={{ height: bottomInset }} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    inputAccessoryLikeContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

export function InputAccessoryView({ children, customKeyboardView }: UIInputAccessoryViewProps) {
    const CustomKeyboardContent = customKeyboardView?.component;
    return (
        <>
            <InputAccessoryViewLike>{children}</InputAccessoryViewLike>
            <CustomKeyboardNativeView>
                {CustomKeyboardContent && (
                    <CustomKeyboardContent {...customKeyboardView?.initialProps} />
                )}
            </CustomKeyboardNativeView>
        </>
    );
}
