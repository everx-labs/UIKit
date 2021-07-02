import * as React from 'react';
import { View } from 'react-native';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.hydrogen';
import { QRCodePure } from './QRCodePure';
import type { QRCodeProps } from '../types';

const BORDER_WIDTH: number = 16;

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        padding: BORDER_WIDTH,
    },
}));

export const QRCodeSquare = (props: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const size =
        props.size && props.size > BORDER_WIDTH * 2
            ? props.size - BORDER_WIDTH * 2
            : props.size;
    return (
        <View style={styles.container}>
            <QRCodePure {...props} size={size} />
        </View>
    );
};
