import type Animated from 'react-native-reanimated';
import { SnapPoints, UINoticeType } from '../types';
import { useBottomToastNoticeYSnapPoints } from './useBottomToastNoticeYSnapPoints';
import { useTopToastNoticeYSnapPoints } from './useTopToastNoticeYSnapPoints';

export const useToastNoticeYSnapPoints = (
    type: UINoticeType,
    noticeHeight: Animated.SharedValue<number>,
    keyboardHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const ySnapPointsBottomToastNotice: SnapPoints = useBottomToastNoticeYSnapPoints(
        noticeHeight,
        keyboardHeight,
    );
    const ySnapPointsTopToastNotice: SnapPoints = useTopToastNoticeYSnapPoints(noticeHeight);

    switch (type) {
        case UINoticeType.TopToast:
            return ySnapPointsTopToastNotice;
        case UINoticeType.BottomToast:
        default:
            return ySnapPointsBottomToastNotice;
    }
};
