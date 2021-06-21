import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
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
            pressOverlay,
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
            pressOverlay.value = Animated.withTiming(1, {
                duration: UIConstant.opacityAnimDuration,
            });
            titleAnim.value = Animated.withTiming(1, {
                duration: UIConstant.opacityAnimDuration,
            });
            iconAnim.value = Animated.withTiming(1, {
                duration: UIConstant.opacityAnimDuration,
            });
        }
    };

    const handlePressOut = () => {
        if (!loading) {
            pressOverlay.value = Animated.withTiming(0, {
                duration: UIConstant.opacityAnimDuration,
            });
            titleAnim.value = Animated.withTiming(0, {
                duration: UIConstant.opacityAnimDuration,
            });
            iconAnim.value = Animated.withTiming(0, {
                duration: UIConstant.opacityAnimDuration,
            });
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
            <View style={style}>
                <Animated.View style={[contentStyle, pressOverlayStyle]}>
                    {React.Children.only(children)}
                </Animated.View>
            </View>
        </TouchableNativeFeedback>
    );
};
