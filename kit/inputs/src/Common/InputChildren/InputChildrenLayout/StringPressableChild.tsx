import * as React from 'react';
import type { ColorValue, StyleProp, TextStyle } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { TypographyVariants, UILabelAnimated } from '@tonlabs/uikit.themes';
import { defaultInputColorScheme, inputChildrenPressableColors } from '../constants';
import { InputColorScheme } from '../../constants';

export function StringPressableChild({
    children,
    colorScheme = InputColorScheme.Default,
    style,
    role,
}: {
    children: string;
    colorScheme?: InputColorScheme;
    style?: StyleProp<TextStyle>;
    role?: TypographyVariants;
}) {
    const colors = React.useMemo<PressableColors>(() => {
        return inputChildrenPressableColors[colorScheme ?? defaultInputColorScheme];
    }, [colorScheme]);

    const contentColor = usePressableContentColor(colors);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    return (
        <UILabelAnimated role={role} animatedProps={animatedLabelProps} style={style}>
            {children}
        </UILabelAnimated>
    );
}
