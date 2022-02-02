import * as React from 'react';
import { withTiming, withSpring } from 'react-native-reanimated';
import type {
    EntryExitAnimationFunction,
    StyleProps,
    WithSpringConfig,
    WithTimingConfig,
    LayoutAnimation,
} from 'react-native-reanimated';

export type LayoutAnimationFunctions = {
    entering: EntryExitAnimationFunction;
    exiting: EntryExitAnimationFunction;
};

const withSpringConfig: WithSpringConfig = {
    stiffness: 500,
    restSpeedThreshold: 0.7,
    restDisplacementThreshold: 0.03,
};
const withTimingConfig: WithTimingConfig = { duration: 200 };
// @inline
const CLOSED_SCALE = 0.9;
// @inline
const OPENED_SCALE = 1;
// @inline
const CLOSED_OPACITY = 0;
// @inline
const OPENED_OPACITY = 1;

export function usePopupLayoutAnimationFunctions(): LayoutAnimationFunctions {
    return React.useMemo(() => {
        function entering(): LayoutAnimation {
            'worklet';

            const animations: StyleProps = {
                opacity: withTiming(OPENED_OPACITY, withTimingConfig),
                transform: [{ scale: withSpring(OPENED_SCALE, withSpringConfig) }],
            };
            const initialValues: StyleProps = {
                opacity: CLOSED_OPACITY,
                transform: [{ scale: CLOSED_SCALE }],
            };

            return {
                initialValues,
                animations,
            };
        }

        function exiting(): LayoutAnimation {
            'worklet';

            const animations: StyleProps = {
                opacity: withTiming(CLOSED_OPACITY, withTimingConfig),
                transform: [{ scale: withSpring(CLOSED_SCALE, withSpringConfig) }],
            };
            const initialValues: StyleProps = {
                opacity: OPENED_OPACITY,
                transform: [{ scale: OPENED_SCALE }],
            };
            return {
                initialValues,
                animations,
            };
        }

        return { entering, exiting };
    }, []);
}
