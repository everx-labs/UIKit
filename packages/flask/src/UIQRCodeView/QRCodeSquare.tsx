import * as React from 'react';
import { View } from 'react-native';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.hydrogen';
import QRCode from 'qrcode';
import Svg, { Path } from 'react-native-svg';
import { useLogoRender } from './hooks';
import type { QRCodeProps } from '../types';
import { QR_CODE_SIZE, SQUARE_QR_CODE_BORDER_WIDTH } from '../constants';
import { getQRSvg } from './utils';

const useStyles = makeStyles((theme) => {
    return {
        container: {
            backgroundColor: theme[ColorVariants.BackgroundPrimary],
            padding: SQUARE_QR_CODE_BORDER_WIDTH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: QR_CODE_SIZE + SQUARE_QR_CODE_BORDER_WIDTH * 2,
            width: QR_CODE_SIZE + SQUARE_QR_CODE_BORDER_WIDTH * 2,
        },
        qrContainer: {
            position: 'absolute',
            top: SQUARE_QR_CODE_BORDER_WIDTH,
            left: SQUARE_QR_CODE_BORDER_WIDTH,
            right: SQUARE_QR_CODE_BORDER_WIDTH,
            bottom: SQUARE_QR_CODE_BORDER_WIDTH,
        },
    };
});

export const QRCodeSquare = ({ value, logo }: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const isThereLogo = logo !== undefined;
    const size = QR_CODE_SIZE;

    const qrSvg = React.useMemo(() => getQRSvg(qr, size, isThereLogo), [
        qr,
        size,
        isThereLogo,
    ]);
    const logoRender = useLogoRender(logo);

    return (
        <View style={styles.container}>
            <View style={styles.qrContainer}>
                <Svg width={size} height={size}>
                    <Path
                        fill={
                            theme[
                                ColorVariants.BackgroundPrimaryInverted
                            ] as string
                        }
                        d={qrSvg}
                    />
                </Svg>
            </View>
            {logoRender}
        </View>
    );
};
