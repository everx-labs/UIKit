import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { UIConstant } from '../constants';

type TouchableElementProps = {
    animations?: any;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
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
    onPress,
    style,
    contentStyle,
    testID,
    ...props
}: TouchableElementProps) => {
    const {
        animatedPress: {
            pressAnim,
            pressBackgroundStyle,
            pressOverlayStyle,
        },
        animatedTitle: {
            titleAnim,
        },
        animatedIcon: {
            iconAnim,
        },
    } = animations;

    const handlePressIn = () => {
        if (!loading) {
            pressAnim.value = Animated.withTiming(1, UIConstant.animationConfig);
            titleAnim.value = Animated.withTiming(1, UIConstant.animationConfig);
            iconAnim.value = Animated.withTiming(1, UIConstant.animationConfig);
        }
    };

    const handlePressOut = () => {
        if (!loading) {
            pressAnim.value = Animated.withTiming(0, UIConstant.animationConfig);
            titleAnim.value = Animated.withTiming(0, UIConstant.animationConfig);
            iconAnim.value = Animated.withTiming(0, UIConstant.animationConfig);
        }
    };

    return (
        <TouchableNativeFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[style, pressBackgroundStyle]}>
                <Animated.View style={[contentStyle, pressOverlayStyle]}>
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableNativeFeedback>
    );
};
