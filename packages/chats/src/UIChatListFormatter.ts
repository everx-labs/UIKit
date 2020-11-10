import { ChatMessageType } from "./types";
import type { ChatMessage } from "./types";

export type Section = { time: number; data: ChatMessage[]; key?: number };

export class UIChatListFormatter {
    static getSections(messages: ChatMessage[]): Section[] {
        const sections: { [key: number]: ChatMessage[] } = {};

        messages.forEach((message, index) => {
            const messageTime = new Date(message.time);
            messageTime.setHours(0, 0, 0, 0);

            if (index > 0) {
                const nextMessage = messages[index - 1];
                const isTransaction =
                    message.type === ChatMessageType.Transaction;
                const isSystem = message.type === ChatMessageType.System;
                const nextIsSystem =
                    nextMessage?.type === ChatMessageType.System;
                const nextIsTransaction =
                    nextMessage?.type === ChatMessageType.Transaction;

                message.lastFromChain =
                    message.sender !== nextMessage?.sender ||
                    nextIsTransaction ||
                    isTransaction ||
                    (!isSystem && nextIsSystem) ||
                    (isSystem && !nextIsSystem);
            } else {
                message.lastFromChain = true;
            }

            if (index < messages.length - 1) {
                const prevMessage = messages[index + 1];
                const isSystem = message.type === ChatMessageType.System;
                const isTransaction =
                    message.type === ChatMessageType.Transaction;
                const prevIsSystem =
                    prevMessage?.type === ChatMessageType.System;
                const prevIsTransaction =
                    prevMessage?.type === ChatMessageType.Transaction;
                const durationTooLong =
                    message.time - (prevMessage?.time - 0) > 3 * 60 * 60 * 1000; // 3 hours

                message.firstFromChain =
                    message.sender !== prevMessage?.sender ||
                    (isSystem && !prevIsSystem) ||
                    (!isSystem && prevIsSystem) ||
                    prevIsTransaction ||
                    isTransaction ||
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

        return Object.keys(sections).map((t) => {
            const time = Number(t);
            return {
                time,
                data: sections[time],
                key: time,
            };
        });
    }
}
