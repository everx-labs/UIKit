/* eslint-disable no-param-reassign */
import type { SectionListData } from 'react-native';

import type { ChatMessage } from './types';

export type SectionExtra = { time?: number };

export class UIChatListFormatter {
    static getSections(
        messages: ChatMessage[],
    ): ReadonlyArray<SectionListData<ChatMessage, SectionExtra>> {
        const sections: { [key: number]: ChatMessage[] } = {};

        messages.forEach((message, index) => {
            const messageTime = new Date(message.time);
            messageTime.setHours(0, 0, 0, 0);

            const nextMessage = messages[index - 1];
            const prevMessage = messages[index + 1];

            if (nextMessage) {
                const durationTooLong = nextMessage.time - message.time > 3 * 60 * 60 * 1000; // 3 hours

                message.lastFromChain =
                    message.type !== nextMessage.type ||
                    message.status !== nextMessage.status ||
                    durationTooLong;
            } else {
                message.lastFromChain = true;
            }

            if (prevMessage) {
                const durationTooLong = message.time - prevMessage.time > 3 * 60 * 60 * 1000; // 3 hours

                message.firstFromChain =
                    message.type !== prevMessage.type ||
                    message.status !== prevMessage.status ||
                    durationTooLong;
            } else {
                message.firstFromChain = true;
            }

            if (sections[messageTime.getTime()]) {
                sections[messageTime.getTime()].push(message);
            } else {
                sections[messageTime.getTime()] = [message];
            }
        });

        return Object.keys(sections).map(t => {
            const time = Number(t);
            return {
                time,
                data: sections[time],
                key: t,
            };
        });
    }
}
