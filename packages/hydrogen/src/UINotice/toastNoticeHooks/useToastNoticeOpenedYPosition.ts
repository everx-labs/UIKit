import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIConstant } from '../../constants';

export const useToastNoticeOpenedYPosition = (
    noticeHeight: Animated.SharedValue<number>,
): Animated.DerivedValue<number> => {
    const { bottom } = useSafeAreaInsets();
    const paddingBottom = Math.max(bottom, UIConstant.contentOffset);

    return useDerivedValue(() => {
        return -noticeHeight.value - paddingBottom;
    });
};
