import * as React from 'react';
import {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';
import { useHover } from '@tonlabs/uikit.controls';
import { ColorVariants, useColorParts } from '@tonlabs/uikit.themes';

const withSpringConfig: WithSpringConfig = {
    stiffness: 1000,
    overshootClamping: true,
};

export function useContainerHoverAnimatedStyle() {
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const isHoveredAnimated = useDerivedValue(() => {
        return withSpring(isHovered ? 1 : 0, withSpringConfig);
    }, [isHovered]);
    const colorParts = useColorParts(ColorVariants.BackgroundSecondary);
    const colors = React.useMemo(() => {
        return {
            defaultColor: `rgba(${colorParts.colorParts}, ${0})`,
            hoveredColor: `rgba(${colorParts.colorParts}, ${colorParts.opacity})`,
        };
    }, [colorParts]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                isHoveredAnimated.value,
                [0, 1],
                [colors.defaultColor, colors.hoveredColor],
            ),
        };
    }, [colors]);
    return { animatedStyle, onMouseEnter, onMouseLeave };
}
