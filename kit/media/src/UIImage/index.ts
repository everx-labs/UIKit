import type * as React from 'react';
import type { Image } from 'react-native';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { UIImage as PlatformUIImage } from './UIImage';
import type { UIImageProps } from './types';

export type { UIImageProps } from './types';
export const UIImage: React.ForwardRefExoticComponent<UIImageProps & React.RefAttributes<Image>> =
    PlatformUIImage;
