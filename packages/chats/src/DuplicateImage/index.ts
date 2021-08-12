import type * as React from 'react';
// @ts-expect-error do not work with '.web', '.ios' and '.android' suffixes
// eslint-disable-next-line import/no-unresolved, import/extensions
import { DuplicateImage as DuplicateImageImpl } from './DuplicateImage';
import type { DuplicateImageProps } from './types';

export * from './types';

export const DuplicateImage: React.FC<DuplicateImageProps> = DuplicateImageImpl;
