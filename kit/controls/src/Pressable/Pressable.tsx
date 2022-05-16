import * as React from 'react';
import { Pressable as PressablePlatform } from 'react-native';
import { useHover } from '../useHover';
import { PressableStateContext } from './constants';
import type { PressableProps } from './types';
import { usePressed, usePressableState, useConvertToAnimatedValue } from './hooks';

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

    const isDisabledAnimated = useConvertToAnimatedValue(disabled);
    const isLoadingAnimated = useConvertToAnimatedValue(loading);
    const isPressedAnimated = useConvertToAnimatedValue(isPressed);
    const isHoveredAnimated = useConvertToAnimatedValue(isHovered);

    const pressableState = usePressableState(
        isDisabledAnimated,
        isLoadingAnimated,
        isPressedAnimated,
        isHoveredAnimated,
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
                style={style}
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </PressablePlatform>
        </PressableStateContext.Provider>
    );
}
