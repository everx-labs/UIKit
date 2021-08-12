import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';
// @ts-expect-error do not work with '.web' and '.native' suffixes
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useDimensions as useDimensionsImpl } from './useDimensions';
import type { Dimensions } from '../types';
import type { VisibilityState } from '../constants';

export * from './duplicateContentHooks';
export const useDimensions: (
    originalRef: React.RefObject<View>,
    visibilityState: Animated.SharedValue<VisibilityState>,
) => Dimensions = useDimensionsImpl;
