export const ChatMessageContent = {
    SimpleText: 'stm',
    Invite: 'inv',
    AttachmentImage: 'aim',
    AttachmentDocument: 'doc',
    TransactionInChat: 'trx',
    LinkActionMessage: 'lam',
    ActionButton: 'act',
    DateSeparator: 'date',
    EmptyChat: 'empty',
};

export const ChatMessageStatus = {
    Sent: 'sent',
    Sending: 'sending',
    Received: 'received',
    Rejected: 'rejected',
    Aborted: 'aborted',
};

export const TypeOfTransaction = {
    Deposit: 'deposit',
    Withdraw: 'withdraw',
    Income: 'income',
    Spending: 'spending',
    Bill: 'bill',
    Invoice: 'invoice',
    Invite: 'invite',
    Compliment: 'compliment',
};

export const TypeOfAction = {
    Default: 'default',
    Link: 'link',
};

export const TypeOfActionDirection = {
    None: 'none',
    Up: 'up',
    Down: 'down',
};

export type ChatMessageContentType = $Values<typeof ChatMessageContent>;
export type ChatMessageStatusType = $Values<typeof ChatMessageStatus>;
export type TypeOfTransactionType = $Values<typeof TypeOfTransaction>;
export type TypeOfActionType = $Values<typeof TypeOfAction>;
export type TypeOfActionDirectionType = $Values<typeof TypeOfActionDirection>;

export type TransactionInfo = {
    separator: string,
    amountLocalized: string,
    amount: number,
    token: string,
    sent: boolean,
    currency?: {
        rate: number,
        symbol: string,
    },
    type: ?TypeOfTransactionType,
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
    transactionInfo: ?TransactionInfo,
    imageSize: ?UIChatImageSize;
    docName: ?string,
    fileSize: ?number,
    actionType: ?TypeOfActionType,
};

export type UIChatCellInfo = {
    data: any,
    type: ChatMessageContentType,
    status: ChatMessageStatusType,
    additionalInfo: ChatAdditionalInfo,
};
