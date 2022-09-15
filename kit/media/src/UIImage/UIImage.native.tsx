import * as React from 'react';

import type { Image as RNImage, ImageURISource } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

import { useTheme } from '@tonlabs/uikit.themes';

// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { Image } from './Image';
import type { UIImageProps, UIImageSimpleProps } from './types';

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

const UIImageSimple = React.forwardRef<RNImage, UIImageSimpleProps>(function UIImageSimple(
    props: UIImageSimpleProps,
    ref,
) {
    if (props.tintColor) {
        /**
         * tintColor for some reason don't work properly with
         * react-native-fast-image, hence passing this prop
         * we force to use default <Image /> from RN
         */
        return React.createElement(Image, { ...props, ref });
    }
    // @ts-expect-error
    return React.createElement(FastImage, { ref, ...props });
});

export const UIImage = React.memo(
    React.forwardRef<RNImage, UIImageProps>(function UIImage(
        { tintColor, ...rest }: UIImageProps,
        ref,
    ) {
        const theme = useTheme();
        return React.createElement(UIImageSimple, {
            ...rest,
            ref,
            ...(tintColor != null ? { tintColor: theme[tintColor] } : {}),
        });
    }),
);

export const UIAnimatedImage = Animated.createAnimatedComponent(UIImageSimple);
