import { Platform } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import { runOnUIPlatformSelect } from './useScrollHandler/runOnUIPlatformSelect';

// @inline
const RUBBER_BAND_EFFECT_DISTANCE_WEB = 50;
// @inline
const RUBBER_BAND_EFFECT_DISTANCE_DEFAULT = 100;

export const NON_UI_RUBBER_BAND_EFFECT_DISTANCE = Platform.select({
    web: RUBBER_BAND_EFFECT_DISTANCE_WEB,
    default: RUBBER_BAND_EFFECT_DISTANCE_DEFAULT,
});

/**
 * @returns a shared value with a rubber band distance constant to use in worklets
 */
export function useRubberBandEffectDistance() {
    return useDerivedValue(() => {
        return runOnUIPlatformSelect({
            web: RUBBER_BAND_EFFECT_DISTANCE_WEB,
            default: RUBBER_BAND_EFFECT_DISTANCE_DEFAULT,
        });
    });
}
