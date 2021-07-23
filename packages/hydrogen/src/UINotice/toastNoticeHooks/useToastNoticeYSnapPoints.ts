import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIConstant } from '../../constants';

export const useToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
) => {
    const { bottom } = useSafeAreaInsets();
    const paddingBottom = Math.max(bottom, UIConstant.contentOffset);

    const openedYSnapPoint = useDerivedValue(() => {
        return -noticeHeight.value - paddingBottom - keyboardHeight.value;
    });
    const closedYSnapPoint = useDerivedValue(() => {
        return -keyboardHeight.value;
    });
    return {
        openedYSnapPoint,
        closedYSnapPoint,
    };
};
