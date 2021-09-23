import type { BrowserMessage } from './types';

export type SectionExtra = { time?: number };

export function getFormattedList(messages: BrowserMessage[]): ReadonlyArray<BrowserMessage> {
    return messages.map((message, index) => {
        const nextMessage = messages[index - 1];
        const prevMessage = messages[index + 1];

        let lastFromChain = true;
        let firstFromChain = true;

        if (nextMessage) {
            lastFromChain =
                message.type !== nextMessage.type || message.status !== nextMessage.status;
        }

        if (prevMessage) {
            firstFromChain =
                message.type !== prevMessage.type || message.status !== prevMessage.status;
        }

        return {
            ...message,
            lastFromChain,
            firstFromChain,
        };
    });
}
