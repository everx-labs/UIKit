import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { UIDevice } from '@tonlabs/uikit.core';
import { UIConstant } from '@tonlabs/uikit.navigation';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import type { SnapPoints } from '../types';

// @inline
const INVALID_VALUE = 100000;

export const useTopToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const statusBarHeight = React.useMemo(() => UIDevice.statusBarHeight(), []);
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
        return -screenHeight + statusBarHeight + UIConstant.contentOffset;
    }, [screenHeight, statusBarHeight]);
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
