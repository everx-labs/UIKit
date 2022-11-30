import * as React from 'react';
import { ColorVariants, makeStyles } from '@tonlabs/uikit.themes';
import type { ImageSourcePropType, ImageStyle, View } from 'react-native';
import { UIImage } from '../../UIImage';
import { useQRCodeLogoSize } from './useQRCodeLogoSize';
import type { QRCodeSize } from '../types';

const useLogoStyles = makeStyles((logoSize: number) => ({
    image: {
        width: logoSize,
        height: logoSize,
    },
}));

export const useLogoRender = (
    logo: ImageSourcePropType | undefined,
    size: QRCodeSize | undefined,
): React.ReactElement<View> | null => {
    const logoSize = useQRCodeLogoSize(size);
    const logoStyles = useLogoStyles(logoSize);
    if (logo) {
        return (
            <UIImage
                source={logo}
                style={logoStyles.image as ImageStyle}
                tintColor={ColorVariants.BackgroundInverted}
            />
        );
    }
    return null;
};
