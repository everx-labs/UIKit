import type * as React from 'react';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { TouchableOpacity as PlatformTouchableOpacity } from './TouchableOpacity';
import type { TouchableOpacityProps } from './types';

export const TouchableOpacity: React.ComponentType<TouchableOpacityProps> =
    PlatformTouchableOpacity;
