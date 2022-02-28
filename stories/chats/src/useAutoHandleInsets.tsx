import * as React from 'react';

export function useAutoHandleInsets() {
    const [shouldAutoHandleInsets, setShouldHandleInsets] = React.useState(true);

    const onInputAccessoryViewAvailable = React.useCallback(() => {
        setShouldHandleInsets(false);
    }, []);

    const onInputAccessoryViewUnavailable = React.useCallback(() => {
        setShouldHandleInsets(true);
    }, []);

    return {
        shouldAutoHandleInsets,
        onInputAccessoryViewAvailable,
        onInputAccessoryViewUnavailable,
        contentInset: undefined,
        onHeightChange: undefined,
    };
}
