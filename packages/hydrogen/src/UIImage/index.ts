import type * as React from 'react';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { UIImage as PlatformUIImage } from './UIImage';
import type { UIImageProps } from './types';

export { UIImageProps } from './types';
export const UIImage: React.FC<UIImageProps> = PlatformUIImage;
