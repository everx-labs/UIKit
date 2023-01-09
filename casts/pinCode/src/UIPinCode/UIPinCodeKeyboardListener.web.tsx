/* eslint-disable no-param-reassign */
import * as React from 'react';
import { withSpring } from 'react-native-reanimated';
import type Animated from 'react-native-reanimated';
import { DOT_WITH_SPRING_CONFIG } from './constants';

// @inline
const DOT_ANIMATION_NOT_ACTIVE = 0;
// @inline
const DOT_ANIMATION_ACTIVE = 1;
export type DotAnimationStatus =
    | typeof DOT_ANIMATION_NOT_ACTIVE
    | typeof DOT_ANIMATION_ACTIVE
    | number;

export function useKeyboardListener(
    activeDotIndex: Animated.SharedValue<number>,
    dotsValues: Animated.SharedValue<number>[],
    dotsAnims: Animated.SharedValue<number>[],
    dotsCount: number,
    disabled: boolean,
) {
    const onWebKeyPressed = React.useCallback(
        (pressedKey: { key: number | string; keyCode: number }) => {
            if (pressedKey.keyCode === 8) {
                // Nothing to delete
                if (activeDotIndex.value <= 0) {
                    return;
                }

                dotsValues[activeDotIndex.value - 1].value = -1;
                dotsAnims[activeDotIndex.value - 1].value = withSpring(
                    DOT_ANIMATION_NOT_ACTIVE,
                    DOT_WITH_SPRING_CONFIG,
                );
                activeDotIndex.value -= 1;
            }
            if (Number.isInteger(+pressedKey.key)) {
                if (activeDotIndex.value > dotsCount - 1) {
                    return;
                }

                // A number was chosen
                dotsValues[activeDotIndex.value].value = Number(pressedKey.key);
                dotsAnims[activeDotIndex.value].value = withSpring(
                    DOT_ANIMATION_ACTIVE,
                    DOT_WITH_SPRING_CONFIG,
                );
                activeDotIndex.value += 1;
            }
        },
        [activeDotIndex, dotsValues, dotsAnims, dotsCount],
    );

    React.useEffect(() => {
        if (disabled) {
            document.removeEventListener('keydown', onWebKeyPressed);

            return () => {
                // Do nothing
            };
        }

        document.addEventListener('keydown', onWebKeyPressed);

        return () => {
            document.removeEventListener('keydown', onWebKeyPressed);
        };
    }, [onWebKeyPressed, disabled]);
}
