import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { defaultInputColorScheme, inputChildrenColors } from '../constants';
import type { InputChildrenColorScheme } from '../types';

export function StringPressableChild({
    children,
    colorScheme,
}: {
    children: string;
    colorScheme?: InputChildrenColorScheme;
}) {
    const colors = React.useMemo<PressableColors>(() => {
        return inputChildrenColors[colorScheme ?? defaultInputColorScheme];
    }, [colorScheme]);

    const contentColor = usePressableContentColor(colors);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    return (
        <UILabelAnimated role={UILabelRoles.Action} animatedProps={animatedLabelProps}>
            {children}
        </UILabelAnimated>
    );
}
