import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { MaterialTextViewContext } from '../MaterialTextViewContext';
import { materialTextViewChildrenColors } from '../constants';

export function StringPressableChild({ children }: { children: string }) {
    const { colorScheme } = React.useContext(MaterialTextViewContext);

    const colors = React.useMemo<PressableColors>(() => {
        return materialTextViewChildrenColors[colorScheme];
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
