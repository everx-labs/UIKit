import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Animated, { withSpring } from 'react-native-reanimated';

import { BUTTON_WITH_SPRING_CONFIG } from '../../constants';

import type { TouchableElementProps } from './types';

export function TouchableElement({
    animations,
    children,
    disabled,
    loading,
    onLongPress,
    onPress,
    style,
    contentStyle,
    testID,
    ...props
}: TouchableElementProps) {
    const { press, title, icon } = animations;

    const handlePressIn = () => {
        if (loading) {
            return;
        }
        if (press) {
            press.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
        if (title) {
            title.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
        if (icon) {
            icon.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    const handlePressOut = () => {
        if (loading) {
            return;
        }
        if (press) {
            press.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
        if (title) {
            title.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
        if (icon) {
            icon.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    return (
        <TouchableNativeFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onLongPress={onLongPress}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            // Disable ripple effect on Android
            background={TouchableNativeFeedback.Ripple('transparent', false)}
        >
            <Animated.View style={[style, press?.backgroundStyle]}>
                <Animated.View style={[styles.overlayContainer, contentStyle, press?.overlayStyle]}>
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
});
