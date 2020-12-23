/* eslint-disable no-shadow */
import type { ImageSourcePropType } from 'react-native';
import type BigNumber from 'bignumber.js';

// Semantically describe a bubble position
// By default:
// Sent is places on the right side
// Pending is also on the right
// Received - on the left
//
// This could be changed in some global config (not there yet).
export enum ChatMessageStatus {
    Sent = 'sent',
    Pending = 'pending',
    Received = 'received',
    Aborted = 'aborted',
}

export type ChatMessageMeta = {
    key: string;
    status: ChatMessageStatus;
    time: number;
    sender: string;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
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

export type PlainTextMessage = ChatMessageMeta & {
    type: ChatMessageType.PlainText;
    text: string;
    actionText?: string;
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

export type SystemMessage = ChatMessageMeta & {
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

export type TransactionMessage = ChatMessageMeta & {
    type: ChatMessageType.Transaction;
    info: {
        type: TransactionType;
        amount: BigNumber; // mostly used for testID purposes
        balanceChange: string | React.ComponentType;
        text?: string;
    };
    comment?: TransactionComment;
    actionText?: string;
    onPress?: () => void | Promise<void>;
};

export type ImageMessage = ChatMessageMeta & {
    type: ChatMessageType.Image;
    // TODO: url???
    size: {
        width: number;
        height: number;
    };
};

export type DocumentMessage = ChatMessageMeta & {
    type: ChatMessageType.Document;
    // TODO: url???
    docName?: string;
    fileSize?: number;
};

export type StickerMessage = ChatMessageMeta & {
    type: ChatMessageType.Sticker;
    source: ImageSourcePropType;
};

export type ActionButtonMessage = ChatMessageMeta & {
    type: ChatMessageType.ActionButton;
    text: string;
    onPress?: () => void | Promise<void>;
};

export type ChatMessage =
    | PlainTextMessage
    | SystemMessage
    | TransactionMessage
    | ImageMessage
    | DocumentMessage
    | StickerMessage
    | ActionButtonMessage;
