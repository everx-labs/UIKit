import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIConstant } from '@tonlabs/uikit.navigation';
import type { SnapPoints } from '../types';

// @inline
const INVALID_VALUE = 100000;

export const useBottomToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const { bottom } = useSafeAreaInsets();
    const paddingBottom = Math.max(bottom, UIConstant.contentOffset);

    const openedYSnapPoint = useDerivedValue(() => {
        if (noticeHeight.value === 0) {
            return INVALID_VALUE;
        }
        return -noticeHeight.value - paddingBottom - keyboardHeight.value;
    }, [paddingBottom]);
    const closedYSnapPoint = useDerivedValue(() => {
        return -keyboardHeight.value;
    });
    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
