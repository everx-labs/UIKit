import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { UIDevice } from '@tonlabs/uikit.core';
import { UIConstant } from '@tonlabs/uikit.navigation';
import type { SnapPoints } from '../types';

export const useTopToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const statusBarHeight = React.useMemo(() => UIDevice.statusBarHeight(), []);
    const screenHeight = useWindowDimensions().height;

    const openedYSnapPoint = useDerivedValue(() => {
        return -screenHeight + statusBarHeight + UIConstant.contentOffset;
    }, [screenHeight, statusBarHeight]);
    const closedYSnapPoint = useDerivedValue(() => {
        if (noticeHeight.value === 0) {
            /** At first render we don't have noticeHeight.value, but we need some value */
            return -screenHeight - UIConstant.notice.defaultNoticeHeight;
        }
        return -screenHeight - noticeHeight.value;
    }, [screenHeight]);

    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
