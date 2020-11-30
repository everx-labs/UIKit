import * as React from 'react';

export type ChatOnScrollListener = (y: number) => void;

let listener: ChatOnScrollListener | null = null;

/*
 * MOTIVATION:
 * We should show a line animation on input when chat is scrolling
 * But to achive it, we should somehow pass scroll events to an input
 * At first we made a method on a ref of input, that imply that a user
 * should provide a ref for input and pass for UIChatList
 * But this is not a good API,
 * since we ask to do staff just to achive some internal results.
 * Thus how this *kind of* hack was introduced.
 * The hack is private, so it can't be used externally, but instead we could
 * easily change behaviour without API changes.
 */

export function useChatOnScrollListener(handler: ChatOnScrollListener) {
    React.useEffect(() => {
        listener = handler;

        return () => {
            listener = null;
        };
    }, [handler]);
}

export function callChatOnScrollListener(y: number) {
    if (listener) {
        listener(y);
    }
}
