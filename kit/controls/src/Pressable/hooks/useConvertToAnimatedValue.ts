import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

/**
 * This is a useful function that tracks changes in the value of a variable from the JS thread.
 * @param value
 * @returns an animated value that will always be equal to the original one from JS thread.
 */
export function useConvertToAnimatedValue<T>(value: T): SharedValue<T> {
    const animatedValue = useSharedValue(value);
    React.useEffect(() => {
        animatedValue.value = value;
    }, [animatedValue, value]);
    return animatedValue;
}
