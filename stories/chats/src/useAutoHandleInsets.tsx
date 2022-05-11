import * as React from 'react';

export function useAutoHandleInsets(defaultValue = true) {
    const [shouldAutoHandleInsets, setShouldHandleInsets] = React.useState(defaultValue);

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
