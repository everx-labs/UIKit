import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import type { ButtonAnimations } from './Button';
import { BUTTON_WITH_SPRING_CONFIG } from '../constants';

type TouchableElementProps = {
    animations: ButtonAnimations;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onLongPress: () => void;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    testID?: string;
}

export const TouchableElement = ({
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
}: TouchableElementProps) => {
    const { press, title, icon } = animations;

    const handlePressIn = () => {
        if (loading) {
            return;
        }
        if (press) {
            press.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
        if (title) {
            title.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
        if (icon) {
            icon.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    const handlePressOut = () => {
        if (loading) {
            return;
        }
        if (press) {
            press.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
        if (title) {
            title.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
        if (icon) {
            icon.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
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
                <Animated.View
                    style={[
                        styles.overlayContainer,
                        contentStyle,
                        press?.overlayStyle,
                    ]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
});
