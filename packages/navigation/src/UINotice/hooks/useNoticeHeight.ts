import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const useNoticeHeight = () => {
    const noticeHeight = useSharedValue<number>(0);

    const onLayoutNotice = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            noticeHeight.value = lHeight;
        },
        [noticeHeight],
    );

    return {
        noticeHeight,
        onLayoutNotice,
    };
};
