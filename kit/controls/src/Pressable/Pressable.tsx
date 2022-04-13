import * as React from 'react';
import { Pressable as PressablePlatform } from 'react-native';
import Animated from 'react-native-reanimated';
import { useHover } from '../useHover';
import { PressableStateContext, PressableStateVariant } from './constants';
import type { PressableProps } from './types';
import { usePressed, usePressableState } from './hooks';

/**
 * It is necessary to simplify the creation of new buttons.
 * It provides a context from which to get the current state of the component.
 *
 * To animate children colors please use `usePressableContentColor` hook in children components.
 */
export function Pressable({
    onPress,
    onLongPress,
    disabled,
    loading,
    children,
    style,
    testID,
}: PressableProps) {
    const { isPressed, onPressIn, onPressOut } = usePressed();
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const pressableState: PressableStateVariant = usePressableState(
        disabled,
        loading,
        isPressed,
        isHovered,
    );

    return (
        <PressableStateContext.Provider value={pressableState}>
            <PressablePlatform
                onPress={onPress}
                onLongPress={onLongPress}
                testID={testID}
                disabled={disabled || loading}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Animated.View
                    style={style}
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
