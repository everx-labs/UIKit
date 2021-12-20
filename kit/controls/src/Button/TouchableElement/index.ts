import type React from 'react';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { TouchableElement as TouchableElementPlatform } from './TouchableElement';
import type { TouchableElementProps } from './types';

export const TouchableElement: React.FC<TouchableElementProps> = TouchableElementPlatform;
export * from './types';
