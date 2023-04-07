import * as React from 'react';
import type { ColorValue, StyleProp, TextStyle } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { defaultInputColorScheme, inputChildrenPressableColors } from '../constants';
import { InputColorScheme } from '../../constants';

export function StringPressableChild({
    children,
    colorScheme = InputColorScheme.Default,
    style,
}: {
    children: string;
    colorScheme?: InputColorScheme;
    style?: StyleProp<TextStyle>;
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
        <UILabelAnimated
            role={UILabelRoles.Action}
            animatedProps={animatedLabelProps}
            style={style}
        >
            {children}
        </UILabelAnimated>
    );
}
