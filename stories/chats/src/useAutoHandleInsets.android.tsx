import * as React from 'react';

const noop = () => undefined;

export function useAutoHandleInsets() {
    const [contentInset, setContentInset] = React.useState({ bottom: 0 });

    const onHeightChange = React.useCallback((height: number) => {
        setContentInset({ bottom: height });
    }, []);

    return {
        shouldAutoHandleInsets: true,
        onInputAccessoryViewAvailable: noop,
        onInputAccessoryViewUnavailable: noop,
        contentInset,
        onHeightChange,
    };
}
