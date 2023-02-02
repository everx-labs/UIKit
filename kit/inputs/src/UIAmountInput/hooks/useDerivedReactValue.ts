import * as React from 'react';
import { DerivedValue, useSharedValue } from 'react-native-reanimated';

export function useDerivedReactValue<T>(value: T): DerivedValue<T> {
    const valueAnimated = useSharedValue(value);
    React.useEffect(() => {
        if (valueAnimated.value !== value) {
            valueAnimated.value = value;
        }
    }, [valueAnimated, value]);
    return valueAnimated;
}
