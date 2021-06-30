import * as React from 'react';
import { View } from 'react-native';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import { QRCodePure } from './QRCodePure';
import type { QRCodeProps } from '../types';

const BORDER_WIDTH: number = 16;

export const QRCodeSquare = (props: QRCodeProps) => {
    const theme = useTheme();
    const size =
        props.size && props.size > BORDER_WIDTH * 2
            ? props.size - BORDER_WIDTH * 2
            : props.size;
    return (
        <View
            style={{
                backgroundColor: theme[ColorVariants.BackgroundPrimary],
                padding: BORDER_WIDTH,
            }}
        >
            <QRCodePure {...props} size={size} />
        </View>
    );
};
