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
    Menu = 'Menu',
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
    prompt: string;
    onSendText: OnSendText;
};

export type AddressInputMessage = {
    type: InteractiveMessageType.AddressInput;
    prompt: string;
    onSelect: (selectedButtonText: string, address: string) => void;
    mainAddress: string;
    input: {
        validateAddress: ValidateAddress;
    };
    qrCode: {
        parseData: (data: any) => Promise<string>;
    };
};

type MenuItem = {
    handlerId: number;
    title: string;
    description?: string;
};

export type MenuMessage = {
    type: InteractiveMessageType.Menu;
    title: string;
    description?: string;
    items: MenuItem[];
    onSelect: (handlerId: number) => void | Promise<void>;
};

export type InteractiveMessage =
    | TerminalMessage
    | AddressInputMessage
    | MenuMessage;

export type BrowserMessage = VisibleMessage | InteractiveMessage;
