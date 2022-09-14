import * as React from 'react';

/**
 * This function allows you not to call a callback uselessly when calling it multiple times in an event loop.
 *
 * If the event loop does not have time to call a callback and another call of this callback occurs,
 * then this callback will be called only with the parameters that were passed last.
 * @param callback
 * @returns a function that will be called only once
 * if the event loop does not have time to process its multiple calls
 */
export function useCallWithTimeOut<T extends (...args: any[]) => any>(callback: T | undefined): T {
    const callingCallback = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    return React.useCallback<T>(
        // @ts-expect-error
        function callbackWithTimeOut(...args: any[]): any {
            if (callingCallback.current) {
                clearTimeout(callingCallback.current);
                callingCallback.current = null;
            }
            callingCallback.current = setTimeout(() => {
                callback?.(...args);
            });
        },
        [callback],
    );
}
