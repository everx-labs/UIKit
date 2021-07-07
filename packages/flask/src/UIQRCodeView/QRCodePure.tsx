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
import { QR_CODE_DEFAULT_SIZE, QR_CODE_LOGO_SIZE } from '../constants';

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

const useLogoStyles = makeStyles(() => ({
    image: {
        width: QR_CODE_LOGO_SIZE,
        height: QR_CODE_LOGO_SIZE,
    },
}));

export const useLogoRender = (
    logo: ImageSourcePropType | undefined,
): React.ReactElement<View> | null => {
    const logoStyles = useLogoStyles();
    if (logo) {
        return <UIImage source={logo} style={logoStyles.image as ImageStyle} />;
    }
    return null;
};

export const QRCodePure: React.FC<QRCodeProps> = ({
    size = QR_CODE_DEFAULT_SIZE,
    value,
    logo,
}: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(size);
    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const isThereLogo = logo !== undefined;

    const qrSvg = React.useMemo(() => getQRSvg(qr, size, isThereLogo), [
        qr,
        size,
        isThereLogo,
    ]);
    const logoRender = useLogoRender(logo);

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
