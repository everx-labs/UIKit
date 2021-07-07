import * as React from 'react';
import { View } from 'react-native';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.hydrogen';
import { QRCodePure } from './QRCodePure';
import type { QRCodeProps } from '../types';
import { SQUARE_QR_CODE_BORDER_WIDTH } from '../constants';

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        padding: SQUARE_QR_CODE_BORDER_WIDTH,
    },
}));

export const QRCodeSquare = (props: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const size =
        props.size && props.size > SQUARE_QR_CODE_BORDER_WIDTH * 2
            ? props.size - SQUARE_QR_CODE_BORDER_WIDTH * 2
            : props.size;
    return (
        <View style={styles.container}>
            <QRCodePure {...props} size={size} />
        </View>
    );
};
