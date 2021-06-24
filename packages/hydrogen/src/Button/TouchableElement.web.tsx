import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useHover } from '../useHover';
import { BUTTON_WITH_SPRING_CONFIG } from '../constants';
import type { ButtonAnimations } from './Button';

type TouchableElementProps = {
    animations: ButtonAnimations;
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
    const { hover, press, title, icon } = animations;

    const {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    } = useHover();

    React.useEffect(
        () => {
            if (!disabled && !loading && isHovered) {
                if (hover) {
                    hover.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
                }
                if (title) {
                    title.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
                }
                if (icon) {
                    icon.animationParam.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
                }
            } else {
                if (hover) {
                    hover.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
                }
                if (title) {
                    title.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
                }
                if (icon) {
                    icon.animationParam.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
                }
            }
        },
        [disabled, loading, isHovered, hover, title, icon],
    );

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
                style={[style, hover?.backgroundStyle, press?.backgroundStyle]}
            >
                <Animated.View
                    style={[
                        styles.overlayContainer,
                        contentStyle,
                        hover?.overlayStyle,
                        press?.overlayStyle,
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
