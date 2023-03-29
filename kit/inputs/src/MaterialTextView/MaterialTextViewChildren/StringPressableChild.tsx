import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';

import { defaultPressableChildColors } from './constants';

export function StringPressableChild({
    children,
    colors,
}: {
    children: string;
    colors?: PressableColors;
}) {
    const contentColors = React.useMemo(() => {
        return colors ?? defaultPressableChildColors;
    }, [colors]);

    const contentColor = usePressableContentColor(contentColors);

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
