import * as React from 'react';
import { View } from 'react-native';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import QRCode from 'qrcode';
import Svg, { Path } from 'react-native-svg';
import { useLogoRender } from './hooks';
import type { QRCodeProps } from './types';
import { getQRSvg } from './utils';
import { useQRCodeSize } from './hooks/useQRCodeSize';
import { useQRCodeBorderWidth } from './hooks/useQRCodeBorderWidth';
import { useQRCodeLogoSize } from './hooks/useQRCodeLogoSize';

const useStyles = makeStyles((theme, qrCodeSize: number, qrCodeBorderWidth: number) => {
    return {
        container: {
            backgroundColor: theme[ColorVariants.BackgroundPrimary],
            padding: qrCodeBorderWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: qrCodeSize + qrCodeBorderWidth * 2,
            width: qrCodeSize + qrCodeBorderWidth * 2,
        },
        qrContainer: {
            position: 'absolute',
            top: qrCodeBorderWidth,
            left: qrCodeBorderWidth,
            right: qrCodeBorderWidth,
            bottom: qrCodeBorderWidth,
        },
    };
});

export const QRCodeSquare = ({ value, logo, size }: QRCodeProps) => {
    const theme = useTheme();
    const qrCodeSize = useQRCodeSize(size);
    const qrCodeBorderWidth = useQRCodeBorderWidth(size);
    const logoSize = useQRCodeLogoSize(size);
    const styles = useStyles(theme, qrCodeSize, qrCodeBorderWidth);
    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const isThereLogo = logo !== undefined;

    const qrSvg = React.useMemo(
        () => getQRSvg(qr, qrCodeSize, logoSize, isThereLogo),
        [qr, qrCodeSize, logoSize, isThereLogo],
    );
    const logoRender = useLogoRender(logo, size);

    return (
        <View style={styles.container}>
            <View style={styles.qrContainer}>
                <Svg width={qrCodeSize} height={qrCodeSize}>
                    <Path fill={theme[ColorVariants.BackgroundInverted] as string} d={qrSvg} />
                </Svg>
            </View>
            {logoRender}
        </View>
    );
};
