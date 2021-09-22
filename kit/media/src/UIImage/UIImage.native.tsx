import * as React from 'react';

import { Image } from 'react-native';
import { useTheme } from '@tonlabs/uikit.themes';
import type { UIImageProps } from './types';

const FastImage = require('react-native-fast-image');

export function UIImage({ tintColor, ...rest }: UIImageProps) {
    const theme = useTheme();
    if (tintColor) {
        /**
         * tintColor for some reason don't work properly with
         * react-native-fast-image, hence passing this prop
         * we force to use default <Image /> from RN
         */
        return (
            <Image
                {...rest}
                style={[rest.style, tintColor != null ? { tintColor: theme[tintColor] } : null]}
            />
        );
    }
    return React.createElement(FastImage, rest);
}
