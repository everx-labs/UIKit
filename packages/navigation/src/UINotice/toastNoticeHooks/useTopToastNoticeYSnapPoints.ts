import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { UIDevice } from '@tonlabs/uikit.core';
import { UIConstant } from '../../constants';
import type { SnapPoints } from '../types';

export const useTopToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const statusBarHeight = React.useMemo(() => UIDevice.statusBarHeight(), []);
    const screenHeight = useWindowDimensions().height;

    const openedYSnapPoint = useDerivedValue(() => {
        return -screenHeight + statusBarHeight + UIConstant.contentOffset;
    });
    const closedYSnapPoint = useDerivedValue(() => {
        return -screenHeight - noticeHeight.value;
    });

    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
