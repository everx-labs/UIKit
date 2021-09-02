/* eslint-disable no-param-reassign */
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { ScrollableParentScrollHandler } from '../../../Scrollable/Context';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import onWheelHandler from './useOnWheelHandler';

export const useOnWheelHandler: (
    yIsNegative: Animated.SharedValue<boolean>,
    hasScrollShared: Animated.SharedValue<boolean>,
    scrollHandler: ScrollableParentScrollHandler,
) => ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | null = onWheelHandler;
