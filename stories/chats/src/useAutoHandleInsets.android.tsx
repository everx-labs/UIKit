import * as React from 'react';
import { useDimensions } from '@tonlabs/uikit.layout';

const noop = () => undefined;

export function useAutoHandleInsets() {
    const { androidNavigationBarHeight } = useDimensions();
    const [contentInset, setContentInset] = React.useState({ bottom: androidNavigationBarHeight });

    const onHeightChange = React.useCallback(
        (height: number) => {
            setContentInset({ bottom: androidNavigationBarHeight + height });
        },
        [androidNavigationBarHeight],
    );

    return {
        shouldAutoHandleInsets: true,
        onInputAccessoryViewAvailable: noop,
        onInputAccessoryViewUnavailable: noop,
        contentInset,
        onHeightChange,
    };
}
