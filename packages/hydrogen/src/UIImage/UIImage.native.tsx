import * as React from 'react';

import { Image } from 'react-native';
import { useTheme } from '../Colors';
import type { UIImageProps } from './types';

const FastImage = require('react-native-fast-image');

export const UIImage = React.forwardRef<Image, UIImageProps>(function UIImageForwarded(
    { tintColor, ...rest }: UIImageProps,
    ref,
) {
    const theme = useTheme();
    if (tintColor) {
        /**
         * tintColor for some reason don't work properly with
         * react-native-fast-image, hence passing this prop
         * we force to use default <Image /> from RN
         */
        return (
            <Image
                ref={ref}
                {...rest}
                style={[rest.style, tintColor != null ? { tintColor: theme[tintColor] } : null]}
            />
        );
    }
    return React.createElement(FastImage, { ref, ...rest });
});
