import type * as React from 'react';
import type { Image } from 'react-native';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { UIImage as PlatformUIImage, prefetch } from './UIImage';
import type { Prefetch, UIImageProps } from './types';

export type { UIImageProps } from './types';
export const UIImage: React.ForwardRefExoticComponent<UIImageProps & React.RefAttributes<Image>> & {
    prefetch: Prefetch;
} = PlatformUIImage;

UIImage.prefetch = prefetch;
