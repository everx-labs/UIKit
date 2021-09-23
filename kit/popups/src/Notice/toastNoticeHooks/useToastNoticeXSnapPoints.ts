import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import type { SnapPoints } from '../types';

const OPENED_X_POSITION = 0;

export const useToastNoticeXSnapPoints = (): SnapPoints => {
    const screenWidth = useWindowDimensions().width;

    const openedSnapPoint = useSharedValue(OPENED_X_POSITION);
    const closedSnapPoint = useDerivedValue(() => {
        return screenWidth;
    }, [screenWidth]);

    return {
        openedSnapPoint,
        closedSnapPoint,
    };
};
