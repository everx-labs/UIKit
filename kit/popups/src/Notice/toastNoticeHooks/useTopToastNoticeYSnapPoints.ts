import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { SnapPoints } from '../types';

// @inline
const INVALID_VALUE = 100000;

export const useTopToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const { top: topInset } = useSafeAreaInsets();
    const screenDimensionsHeight = useWindowDimensions().height;

    const screenHeight = React.useMemo(() => {
        /**
         * Let's be safe if initialWindowMetrics does not has the value
         */
        return initialWindowMetrics?.frame.height != null
            ? initialWindowMetrics?.frame.height
            : screenDimensionsHeight;
    }, [screenDimensionsHeight]);

    const openedYSnapPoint = useDerivedValue(() => {
        return -screenHeight + topInset + UILayoutConstant.contentInsetVerticalX4;
    }, [screenHeight, topInset]);
    const closedYSnapPoint = useDerivedValue(() => {
        if (noticeHeight.value === 0) {
            return INVALID_VALUE;
        }
        return -screenHeight - noticeHeight.value;
    }, [screenHeight]);

    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
