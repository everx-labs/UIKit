import * as React from 'react';

export function usePressed() {
    const [isPressed, setPressed] = React.useState<boolean>(false);
    const onPressIn = React.useCallback(() => {
        setPressed(true);
    }, []);
    const onPressOut = React.useCallback(() => {
        setPressed(false);
    }, []);

    return {
        isPressed,
        onPressIn,
        onPressOut,
    };
}
