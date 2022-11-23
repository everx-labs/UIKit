import { Platform } from 'react-native';

const { OS } = Platform;

/**
 * This function combines the scroll value `x` into a single coordinate system
 * in `RTL` and `LTR` mode on all platforms.
 * Returns `0` to start scrolling and `positive x` value during scrolling.
 */
export function normalizeScrollX(
    x: number,
    isRtl: boolean,
    scrollViewWidth: number,
    scrollViewContentWidth: number,
) {
    'worklet';

    /**
     * There is a problem with scroll coordinate system of different platform on RTL mode.
     * On iOS x-axis starts from right edge of scroll and looks to the left
     * On Android x-axis starts from left edge of scroll and looks to the right
     * On web x-axis starts from right edge of scroll and looks to the right
     */

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
