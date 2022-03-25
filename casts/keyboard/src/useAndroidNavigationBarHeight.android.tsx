import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { useDimensions } from './useDimensions';

export function useAndroidNavigationBarHeight() {
    const { androidNavigationBarHeight } = useDimensions();

    const shared = useSharedValue(androidNavigationBarHeight);

    React.useEffect(() => {
        shared.value = androidNavigationBarHeight;
    }, [androidNavigationBarHeight, shared]);

    return {
        height: androidNavigationBarHeight,
        shared,
    };
}
