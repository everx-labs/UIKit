import * as React from 'react';
import { Pressable as PressablePlatform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useHover } from '../useHover';
import {
    PressableStateContext,
    PressableStateVariant,
    pressableWithSpringConfig,
} from './constants';
import type { PressableProps, PressableColorScheme } from './types';
import {
    usePressed,
    usePressableState,
    usePressableColorScheme,
    useStateBackgroundColor,
} from './hooks';
import { useAnimatedColor } from '../useAnimatedColor';

export function Pressable({
    onPress,
    onLongPress,
    disabled,
    initialColor,
    pressedColor,
    hoveredColor,
    disabledColor,
    children,
    style,
    testID,
}: PressableProps) {
    const { isPressed, onPressIn, onPressOut } = usePressed();
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const pressableState: PressableStateVariant = usePressableState(disabled, isPressed, isHovered);

    const pressableColorScheme: PressableColorScheme = usePressableColorScheme(
        disabledColor,
        hoveredColor,
        initialColor,
        pressedColor,
    );
    const stateBackgroundColor: string = useStateBackgroundColor(
        pressableState,
        pressableColorScheme,
    );
    const animatedBackgroundColor: Readonly<Animated.SharedValue<string | number>> =
        useAnimatedColor(stateBackgroundColor, pressableWithSpringConfig);

    const containerStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: animatedBackgroundColor.value,
        };
    });

    return (
        <PressableStateContext.Provider value={pressableState}>
            <PressablePlatform
                onPress={onPress}
                onLongPress={onLongPress}
                testID={testID}
                disabled={disabled}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Animated.View
                    style={[containerStyles, style]}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {children}
                </Animated.View>
            </PressablePlatform>
        </PressableStateContext.Provider>
    );
}
