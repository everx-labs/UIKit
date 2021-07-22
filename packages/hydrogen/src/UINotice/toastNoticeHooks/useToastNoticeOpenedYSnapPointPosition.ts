import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIConstant } from '../../constants';

export const useToastNoticeOpenedYSnapPointPosition = (
    noticeHeight: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
) => {
    const { bottom } = useSafeAreaInsets();
    const paddingBottom = Math.max(bottom, UIConstant.contentOffset);

    const openedYSnapPointPosition = useDerivedValue(() => {
        console.log('keyboardHeight', keyboardHeight.value);
        return -noticeHeight.value - paddingBottom - keyboardHeight.value;
    });
    const closedYSnapPointPosition = useDerivedValue(() => {
        console.log('keyboardHeight', keyboardHeight.value);
        return -keyboardHeight.value;
    });
    return {
        openedYSnapPointPosition,
        closedYSnapPointPosition,
    };
};
