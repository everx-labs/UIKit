import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useHover } from '../useHover';
import { BUTTON_WITH_SPRING_CONFIG } from '../constants';

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
            hoverAnim,
            hoverBackgroundStyle,
            hoverOverlayStyle,
        },
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

    const {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    } = useHover();

    React.useEffect(
        () => {
            if (!disabled && !loading && isHovered) {
                hoverAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
                titleAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
                iconAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            } else {
                hoverAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
                titleAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
                iconAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            }
        },
        [disabled, loading, isHovered, hoverAnim, titleAnim, iconAnim],
    );

    const handlePressIn = () => {
        if (!loading) {
            pressAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            titleAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            iconAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    const handlePressOut = () => {
        if (!loading) {
            pressAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            titleAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            iconAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
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
            <Animated.View
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={[style, hoverBackgroundStyle, pressBackgroundStyle]}
            >
                <Animated.View
                    style={[
                        styles.overlayContainer,
                        contentStyle,
                        hoverOverlayStyle,
                        pressOverlayStyle,
                    ]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
});
