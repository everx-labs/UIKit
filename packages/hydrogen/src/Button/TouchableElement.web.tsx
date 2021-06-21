import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useHover } from '../useHover';
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
        animatedHover: {
            hoverOverlay,
            hoverOverlayStyle,
        },
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

    const {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    } = useHover();

    React.useEffect(
        () => {
            if (!disabled && !loading && isHovered) {
                hoverOverlay.value = Animated.withTiming(1, {
                    duration: UIConstant.opacityAnimDuration,
                });
                titleAnim.value = Animated.withTiming(1, {
                    duration: UIConstant.opacityAnimDuration,
                });
                iconAnim.value = Animated.withTiming(1, {
                    duration: UIConstant.opacityAnimDuration,
                });
            } else {
                hoverOverlay.value = Animated.withTiming(0, {
                    duration: UIConstant.opacityAnimDuration,
                });
                titleAnim.value = Animated.withTiming(0, {
                    duration: UIConstant.opacityAnimDuration,
                });
                iconAnim.value = Animated.withTiming(0, {
                    duration: UIConstant.opacityAnimDuration,
                });
            }
        },
        [disabled, loading, isHovered, hoverOverlay, titleAnim, iconAnim],
    );

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
        <TouchableWithoutFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View style={style}>
                <Animated.View
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={[contentStyle, hoverOverlayStyle, pressOverlayStyle]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};
