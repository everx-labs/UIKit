import { Platform } from 'react-native';

const { OS } = Platform;

export function normalizeScrollX(
    x: number,
    isRtl: boolean,
    scrollViewWidth: number,
    scrollViewContentWidth: number,
) {
    'worklet';

    switch (OS) {
        case 'ios':
            return x;
        case 'android':
            return isRtl ? scrollViewContentWidth - scrollViewWidth - x : x;
        default:
            return isRtl ? -x : x;
    }
}

export const denormalizeScrollX = normalizeScrollX;
