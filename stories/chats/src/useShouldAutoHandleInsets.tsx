import * as React from 'react';

export function useShouldAutoHandleInsets() {
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
    };
}
