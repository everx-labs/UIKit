import * as React from 'react';

export type ChatOnTapListener = () => void;

let listener: ChatOnTapListener | null = null;

/*
 * MOTIVATION:
 * We should hide a custom keyboard on user tap.
 * At first we made a method on a ref of input, that imply that a user
 * should provide a ref for input and pass for UIChatList
 * But this is not a good API,
 * since we ask to do staff just to achive some internal results.
 * Thus how this *kind of* hack was introduced.
 * The hack is private, so it can't be used externally, but instead we could
 * easily change behaviour without API changes.
 */

export function useChatOnTapListener(handler: ChatOnTapListener) {
    React.useEffect(() => {
        listener = handler;

        return () => {
            listener = null;
        };
    }, [handler]);
}

export function callChatOnTapListener() {
    if (listener) {
        listener();
    }
}
