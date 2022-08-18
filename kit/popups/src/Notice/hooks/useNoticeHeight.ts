import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export const useNoticeHeight = () => {
    const noticeHeight = useSharedValue<number>(0);

    const onLayoutNotice = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }: LayoutChangeEvent) => {
            noticeHeight.value = lHeight;
        },
        [noticeHeight],
    );

    return {
        noticeHeight,
        onLayoutNotice,
    };
};
