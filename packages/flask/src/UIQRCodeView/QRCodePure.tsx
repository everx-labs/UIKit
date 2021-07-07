import * as React from 'react';
import QRCode from 'qrcode';
import Svg, { Path } from 'react-native-svg';
import {
    StyleSheet,
    View,
    ImageStyle,
    ImageSourcePropType,
} from 'react-native';
import {
    UIImage,
    ColorVariants,
    useTheme,
    makeStyles,
} from '@tonlabs/uikit.hydrogen';
import type { QRCodeProps } from '../types';
import { getQRSvg } from './utils';
import {
    QR_CODE_ITEM_BORDER_RADIUS,
    QR_CODE_DEFAULT_SIZE,
    QR_CODE_DEFAULT_LOGO_SIZE,
} from '../constants';

const useStyles = makeStyles((size: number) => {
    return {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: size,
            width: size,
        },
    };
});

const useLogoStyles = makeStyles(
    (logoSize: number, logoMargin: number, logoBackgroundColor: string) => ({
        container: {
            padding: logoMargin,
            backgroundColor: logoBackgroundColor,
        },
        image: {
            width: logoSize,
            height: logoSize,
        },
    }),
);

export const useLogoRender = (
    logo: ImageSourcePropType | undefined,
    logoSize: number,
    logoMargin: number,
    logoBackgroundColor: string,
): React.ReactElement<View> | null => {
    const logoStyles = useLogoStyles(logoSize, logoMargin, logoBackgroundColor);
    if (logo) {
        return (
            <View style={logoStyles.container}>
                <UIImage source={logo} style={logoStyles.image as ImageStyle} />
            </View>
        );
    }
    return null;
};

export const QRCodePure: React.FC<QRCodeProps> = ({
    size = QR_CODE_DEFAULT_SIZE,
    value,
    logo,
    logoSize = QR_CODE_DEFAULT_LOGO_SIZE,
    logoMargin = 0,
    logoBackgroundColor = ColorVariants.BackgroundPrimary,
}: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(size);
    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);

    const qrSvg = React.useMemo(
        () =>
            getQRSvg(
                qr,
                size,
                logoSize,
                logoMargin,
                QR_CODE_ITEM_BORDER_RADIUS,
            ),
        [qr, size, logoSize, logoMargin],
    );
    const logoRender = useLogoRender(
        logo,
        logoSize,
        logoMargin,
        theme[logoBackgroundColor] as string,
    );

    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFillObject}>
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
