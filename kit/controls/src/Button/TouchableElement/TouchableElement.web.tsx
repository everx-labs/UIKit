import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { withSpring } from 'react-native-reanimated';

import { useHover } from '../../useHover';
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
    const { hover, press, title, icon } = animations;

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    React.useEffect(() => {
        if (!disabled && !loading && isHovered) {
            if (hover) {
                hover.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            }
            if (title) {
                title.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            }
            if (icon) {
                icon.animationParam.value = withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            }
        } else {
            if (hover) {
                hover.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            }
            if (title) {
                title.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            }
            if (icon) {
                icon.animationParam.value = withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            }
        }
    }, [disabled, loading, isHovered, hover, title, icon]);

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
        <TouchableWithoutFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onLongPress={onLongPress}
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
                        // @ts-expect-error
                        { cursor: disabled ? 'default' : 'pointer' },
                    ]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
});
