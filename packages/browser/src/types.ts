import type { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';

export type OnSendText = (text: string) => void;
export type OnHeightChange = (height: number) => void;

// eslint-disable-next-line no-shadow
export enum ValidationResultStatus {
    None = 'NONE',
    Success = 'SUCCESS',
    Error = 'ERROR',
    Hint = 'HINT',
}

export type ValidationResult = {
    status: ValidationResultStatus;
    text?: string;
};
export type ValidateAddress = (text: string) => Promise<ValidationResult>;

// eslint-disable-next-line no-shadow
export enum InteractiveMessageType {
    Terminal = 'Terminal',
    AddressInput = 'AddressInput',
}

type PlainTextMessage = {
    key: string;
    status: MessageStatus;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
    type: ChatMessageType.PlainText;
    text: string;
    actionText?: string;
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

type ActionButtonMessage = {
    key: string;
    status: MessageStatus;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
    type: ChatMessageType.ActionButton;
    text: string;
    textMode?: 'ellipsize' | 'fit';
    onPress?: () => void | Promise<void>;
};

export type VisibleMessage = PlainTextMessage | ActionButtonMessage;

export type Input = {
    messages: VisibleMessage[];
    input: React.ReactNode;
};

export type TerminalMessage = {
    type: InteractiveMessageType.Terminal;
    onSendText: OnSendText;
};

export type AddressInputMessage = {
    type: InteractiveMessageType.AddressInput;
    onSelect: (selectedButtonText: string, address: string) => void;
    mainAddress: string;
    input: {
        validateAddress: ValidateAddress;
    };
    qrCode: {
        parseData: (data: any) => Promise<string>;
    };
};

export type InteractiveMessage = TerminalMessage | AddressInputMessage;

export type BrowserMessage = VisibleMessage | InteractiveMessage;
