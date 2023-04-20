import * as React from 'react';

/**
 * Used so that the input is not cut off by other elements.
 * @param defaultValue used by platform iOS, web.
 * @param defaultBottomOffset used by android platform.
 * You should provide default height of the element that is located at the bottom of the Chat (aka ChatInput)
 * to make appropriate contentInset of the chat.
 * @returns
 */
export function useAutoHandleInsets(
    defaultValue: boolean = true,
    _defaultBottomOffset: number | undefined = undefined,
) {
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
