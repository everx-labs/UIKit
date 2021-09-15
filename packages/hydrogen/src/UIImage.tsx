import * as React from 'react';

import { Image, ImageProps, Platform } from 'react-native';
import { ColorVariants, useTheme } from './Colors';

const FastImage = Platform.OS !== 'web' ? require('react-native-fast-image') : null;

const ImageComponent: any = Platform.OS === 'web' ? Image : FastImage;

export type UIImageProps = ImageProps & {
    // tintColor for some reason don't work properly with
    // react-native-fast-image, hence passing this prop
    // we force to use default <Image /> from RN
    tintColor?: ColorVariants | null;
};

export const UIImage = React.forwardRef<Image, UIImageProps>(function UIImageForwarded(
    { tintColor, ...rest }: UIImageProps,
    ref,
) {
    const theme = useTheme();
    if (tintColor) {
        return (
            <Image
                ref={ref}
                {...rest}
                style={[rest.style, tintColor != null ? { tintColor: theme[tintColor] } : null]}
            />
        );
    }
    return React.createElement(ImageComponent, { ref, ...rest });
});
