import * as React from 'react';
import { UIImage, makeStyles } from '@tonlabs/uikit.hydrogen';
import type { ImageSourcePropType, ImageStyle, View } from 'react-native';
import { QR_CODE_LOGO_SIZE } from '../../constants';

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
