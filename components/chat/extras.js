export const ChatMessageContent = {
    SimpleText: 'stm',
    AttachmentImage: 'aim',
    AttachmentDocument: 'doc',
    TransactionInChat: 'trx',
    DateSeparator: 'date',
    EmptyChat: 'empty',
};

export const ChatMessageStatus = {
    Sent: 'sent',
    Sending: 'sending',
    Received: 'received',
};

export type ChatMessageContentType = $Values<typeof ChatMessageContent>;
export type ChatMessageStatusType = $Values<typeof ChatMessageStatus>;

export type TransactionInfo = {
    separator: string,
    localeAmount: string,
    token: string,
    sent: boolean,
    currency?: {
        rate: number,
        symbol: string,
    }
};

export type UIChatMessageInfo = {
    type?: ChatMessageContentType;
    created?: number;
    sender?: string;
    text?: string;
    image?: string;
    document?: string;
    metadata?: any;
    trx?: any;
};

export type UIChatMessage = {
    mid: string,
    info: UIChatMessageInfo,
};

export type UIChatImageSize = {
    width: number,
    height: number,
};

export type ChatAdditionalInfo = {
    message: UIChatMessage,
    lastFromChain: boolean,
    transactionLocalized: ?TransactionInfo,
    imageSize: ?UIChatImageSize;
    docName: ?string,
};

export type UIChatCellInfo = {
    data: any,
    type: ChatMessageContentType,
    status: ChatMessageStatusType,
    additionalInfo: ChatAdditionalInfo,
};
