import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIConstant } from '../../constants';
import type { SnapPoints } from '../types';

export const useBottomToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const { bottom } = useSafeAreaInsets();
    const paddingBottom = Math.max(bottom, UIConstant.contentOffset);

    const openedYSnapPoint = useDerivedValue(() => {
        return -noticeHeight.value - paddingBottom - keyboardHeight.value;
    });
    const closedYSnapPoint = useDerivedValue(() => {
        return -keyboardHeight.value;
    });
    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
