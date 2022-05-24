import type * as React from 'react';
import type { Image } from 'react-native';
import type Animated from 'react-native-reanimated';
import {
    UIImage as PlatformUIImage,
    UIAnimatedImage as PlatformUIAnimatedImage,
    prefetch,
    // @ts-expect-error
    // eslint-disable-next-line import/extensions, import/no-unresolved
} from './UIImage';
import type { Prefetch, UIImageProps, UIImageSimpleProps } from './types';

export type { UIImageProps } from './types';
export const UIImage: React.ForwardRefExoticComponent<UIImageProps & React.RefAttributes<Image>> & {
    prefetch: Prefetch;
} = PlatformUIImage;
export const UIAnimatedImage: React.FunctionComponent<
    Animated.AnimateProps<UIImageSimpleProps & React.RefAttributes<Image>>
> = PlatformUIAnimatedImage;

UIImage.prefetch = prefetch;
