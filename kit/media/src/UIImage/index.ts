import type * as React from 'react';
import type { Image } from 'react-native';
import {
    UIImage as PlatformUIImage,
    UIAnimatedImage as PlatformUIAnimatedImage,
    prefetch,
    // @ts-expect-error
    // eslint-disable-next-line import/extensions, import/no-unresolved
} from './UIImage';
import type { Prefetch, UIImageProps } from './types';

export type { UIImageProps } from './types';
export const UIImage: React.ForwardRefExoticComponent<UIImageProps & React.RefAttributes<Image>> & {
    prefetch: Prefetch;
} = PlatformUIImage;
export const UIAnimatedImage = PlatformUIAnimatedImage;

UIImage.prefetch = prefetch;
