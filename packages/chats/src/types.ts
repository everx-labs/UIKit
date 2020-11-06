export enum ChatMessageStatus {
    Sent = "sent",
    Sending = "sending",
    Received = "received",
    Rejected = "rejected",
    Aborted = "aborted",
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
    PlainText = "stm",
    System = "sys",
    Transaction = "trx",
    TransactionComment = "trxComment",
    Image = "aim",
    Document = "doc",
    Sticker = "stk",
    ActionButton = "act", // TODO: check chain rider
}

export type PlainTextMessage = ChatMessageMeta & {
    type: ChatMessageType.PlainText;
    text: string;
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

export type SystemMessage = ChatMessageMeta & {
    type: ChatMessageType.System;
    text: string;
};

export enum TransactionType {
    Aborted = "aborted",
    Deposit = "deposit",
    Withdraw = "withdraw",
    Income = "income",
    Spending = "spending",
    Bill = "bill",
    Invoice = "invoice",
    Invite = "invite",
    Compliment = "compliment",
}

export type TransactionMessage = ChatMessageMeta & {
    type: ChatMessageType.Transaction;
    info: {
        type: TransactionType;
        amount: number;
    };
};

export type TransactionCommentMessage = ChatMessageMeta & {
    type: ChatMessageType.TransactionComment;
    text: string;
    encrypted?: boolean;
    encType?: string;
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
    | TransactionCommentMessage
    | ImageMessage
    | DocumentMessage
    | StickerMessage
    | ActionButtonMessage;
