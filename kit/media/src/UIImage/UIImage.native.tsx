import * as React from 'react';

import { Image, ImageURISource } from 'react-native';
import { useTheme } from '@tonlabs/uikit.themes';
import FastImage, { Source } from 'react-native-fast-image';
import type { UIImageProps } from './types';

export function prefetch(content: ImageURISource[] | ImageURISource): void {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        /**
         * Nothing to prefetch
         */
        return;
    }

    const imageToPreload: Source[] = [];
    if (Array.isArray(content)) {
        content.forEach((contentItem: ImageURISource): void => {
            imageToPreload.push({ ...contentItem, cache: 'immutable' });
        });
    } else {
        imageToPreload.push({ ...content, cache: 'immutable' });
    }
    if (imageToPreload.length > 0) {
        FastImage.preload(imageToPreload);
    }
}

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
    // @ts-expect-error
    return React.createElement(FastImage, { ref, ...rest });
});
