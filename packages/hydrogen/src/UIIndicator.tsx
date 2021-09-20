import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import { ColorVariants, useTheme } from './Colors';

export type UIIndicatorProps = {
    color?: ColorVariants;
    size?: number;
    trackWidth?: number;
    style?: StyleProp<ViewStyle>;
};

export function UIIndicator({
    color = ColorVariants.LineAccent,
    size,
    trackWidth,
    style,
}: UIIndicatorProps) {
    const theme = useTheme();

    return (
        <MaterialIndicator color={theme[color]} size={size} trackWidth={trackWidth} style={style} />
    );
}
