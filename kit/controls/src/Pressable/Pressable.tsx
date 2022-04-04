import * as React from 'react';
import { View, Pressable as PressablePlatform } from 'react-native';
import { useHover } from '../useHover';
import { PressableStateVariant } from './constants';
import { usePressed } from './hooks/usePressed';
import type { PressableProps } from './types';

const PressableStateContext = React.createContext<PressableStateVariant>(
    PressableStateVariant.Loading,
);

export function Pressable({
    onPress,
    onLongPress,
    disabled,
    loading,
    initialColor,
    pressColor,
    hoverColor,
    disabledColor,
    children,
    style,
    testID,
}: PressableProps) {
    const { isPressed, onPressIn, onPressOut } = usePressed();

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const pressableState = React.useMemo((): PressableStateVariant => {
        if (loading) {
            return PressableStateVariant.Loading;
        }
        if (disabled) {
            return PressableStateVariant.Disabled;
        }
        if (isPressed) {
            return PressableStateVariant.Pressed;
        }
        if (isHovered) {
            return PressableStateVariant.Hovered;
        }
        return PressableStateVariant.Initial;
    }, [loading, disabled, isPressed, isHovered]);

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
                <View
                    style={style}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {children}
                </View>
            </PressablePlatform>
        </PressableStateContext.Provider>
    );
}
