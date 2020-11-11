import type { ImageSourcePropType } from "react-native";
import type BigNumber from "bignumber.js";

// Semantically describe a bubble position
// By default:
// Sent is places on the right side
// Pending is also on the right
// Received - on the left
//
// This could be changed in some global config (not there yet).
export enum ChatMessageStatus {
    Sent = "sent",
    Pending = "pending",
    Received = "received",
}

// Aborted = "aborted", // TODO: make property on text bubbles to handle aborted state!

export type ChatMessageMeta = {
    key: string;
    status: ChatMessageStatus;
    time: number;
    sender: string;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
};

export enum ChatMessageType {
    PlainText = "stm",
    System = "sys",
    Transaction = "trx",
    Image = "aim",
    Document = "doc",
    Sticker = "stk",
    ActionButton = "act", // TODO: check chain rider
}

export type PlainTextMessage = ChatMessageMeta & {
    type: ChatMessageType.PlainText;
    text: string;
    isAborted: boolean; // TODO: support it
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

export type SystemMessage = ChatMessageMeta & {
    type: ChatMessageType.System;
    text: string;
};

export enum TransactionType {
    Income = "income",
    Expense = "expense",
    Aborted = "aborted",
    // Spending = "spending",
    // Deposit = "deposit",
    // Bill = "bill",
    // Invoice = "invoice",
    // Invite = "invite",
    // Compliment = "compliment",
}

export type TransactionComment = {
    text: string;
    encrypted: boolean;
};

export type TransactionMessage = ChatMessageMeta & {
    type: ChatMessageType.Transaction;
    info: {
        type: TransactionType;
        amount: BigNumber;
        text?: string;
    };
    comment?: TransactionComment;
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

export enum TypeOfAction {
    Default = "default",
    Link = "link",
}

export enum TypeOfActionDirection {
    None = "none",
    Up = "up",
    Down = "down",
}

export type ActionButtonMessage = ChatMessageMeta & {
    type: ChatMessageType.ActionButton;
    actionType: TypeOfAction;
    direction: TypeOfActionDirection;
};

export type ChatMessage =
    | PlainTextMessage
    | SystemMessage
    | TransactionMessage
    | ImageMessage
    | DocumentMessage
    | StickerMessage
    | ActionButtonMessage;
