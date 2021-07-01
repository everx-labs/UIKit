import * as React from 'react';
import QRCode from 'qrcode';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import { UIImage, ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import type { QRCodeProps } from '../types';
import { getQRSvg } from './utils';

const RADIUS_OF_SQUARE: number = 1;
const DEFAULT_SIZE: number = 200;
const DEFAULT_LOGO_SIZE: number = 40;

export const renderLogo = (
    logo: number | undefined,
    logoSize: number,
    logoMargin: number,
    logoBackgroundColor: string | undefined,
    defaultBackgroundColor: string,
): React.ReactElement<View> | null => {
    if (logo) {
        return (
            <View
                style={{
                    padding: logoMargin,
                    backgroundColor:
                        logoBackgroundColor || defaultBackgroundColor,
                }}
            >
                <UIImage
                    source={logo}
                    style={{
                        width: logoSize,
                        height: logoSize,
                    }}
                />
            </View>
        );
    }
    return null;
};

export const QRCodePure: React.FC<QRCodeProps> = ({
    size = DEFAULT_SIZE,
    value,
    logo,
    logoSize = DEFAULT_LOGO_SIZE,
    logoMargin = 0,
    logoBackgroundColor,
}: QRCodeProps) => {
    const theme = useTheme();
    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);

    const qrSvg = React.useMemo(
        () => getQRSvg(qr, size, logoSize, logoMargin, RADIUS_OF_SQUARE),
        [qr, size, logoSize, logoMargin],
    );

    return (
        <View
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: size,
                width: size,
            }}
        >
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
            {renderLogo(
                logo,
                logoSize,
                logoMargin,
                logoBackgroundColor,
                theme[ColorVariants.BackgroundPrimary] as string,
            )}
        </View>
    );
};
