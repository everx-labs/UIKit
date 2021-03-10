/* eslint-disable no-shadow */
import type {
    ImageSourcePropType,
    LayoutChangeEvent,
    ViewProps,
} from 'react-native';
import type BigNumber from 'bignumber.js';

// Semantically describe a bubble position
// By default:
// Sent is places on the right side
// Pending is also on the right
// Received - on the left
//
// This could be changed in some global config (not there yet).
export enum MessageStatus {
    Sent = 'sent',
    Pending = 'pending',
    Received = 'received',
    Aborted = 'aborted',
}

export type OnLayoutCell = (key: string, e: LayoutChangeEvent) => void;

export type BubbleBaseT = {
    key: string;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
    status: MessageStatus;
    onLayout?: ViewProps['onLayout'];
};

export enum ChatMessageType {
    PlainText = 'stm',
    System = 'sys',
    Transaction = 'trx',
    Image = 'aim',
    Document = 'doc',
    Sticker = 'stk',
    ActionButton = 'act',
}

export type PlainTextMessage = BubbleBaseT & {
    type: ChatMessageType.PlainText;
    text: string;
    actionText?: string;
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

export type ActionButtonMessage = BubbleBaseT & {
    type: ChatMessageType.ActionButton;
    text: string;
    textMode?: 'ellipsize' | 'fit';
    onPress?: () => void | Promise<void>;
};

// Props that required for proper chat rendering
type ChatMeta = {
    time: number;
    sender: string;
};

export type ChatPlainTextMessage = ChatMeta & PlainTextMessage;

export type SystemMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.System;
        text: string;
    };

export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export type TransactionComment = {
    text: string;
    encrypted: boolean;
};

export type TransactionMessage = BubbleBaseT &
    ChatMeta & {
        // ---
        time: number;
        sender: string;
        // ---
        type: ChatMessageType.Transaction;
        info: {
            type: TransactionType;
            amount: BigNumber; // mostly used for testID purposes
            balanceChange: string | React.ReactElement<any, any>;
            text?: string;
        };
        comment?: TransactionComment;
        actionText?: string;
        onPress?: () => void | Promise<void>;
    };

export type ImageMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Image;
        // TODO: url???
        size: {
            width: number;
            height: number;
        };
    };

export type DocumentMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Document;
        // TODO: url???
        docName?: string;
        fileSize?: number;
    };

export type StickerMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Sticker;
        source: ImageSourcePropType;
    };

export type ChatActionButtonMessage = ChatMeta & ActionButtonMessage;

export type ChatMessage =
    | ChatPlainTextMessage
    | ChatActionButtonMessage
    | SystemMessage
    | TransactionMessage
    | ImageMessage
    | DocumentMessage
    | StickerMessage;
