import type { ChatMessageType, BubbleBaseT } from '@tonlabs/uikit.chats';
import type BigNumber from 'bignumber.js';

export type OnSendText = (text: string) => void;
export type OnSendAmount = (amount: BigNumber) => void;
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
    Confirm = 'Confirm',
    AmountInput = 'AmountInput',
}

type PlainTextMessage = BubbleBaseT & {
    type: ChatMessageType.PlainText;
    text: string;
    actionText?: string;
    onTouchText?: () => void | Promise<void>;
    onPressUrl?: (url: string, index?: number) => void | Promise<void>;
};

type ActionButtonMessage = BubbleBaseT & {
    type: ChatMessageType.ActionButton;
    text: string;
    textMode?: 'ellipsize' | 'fit';
    onPress?: () => void | Promise<void>;
};

// eslint-disable-next-line no-shadow
export enum BrowserMessageType {
    ConfirmSuccessful = 'ConfirmSuccessful',
    ConfirmDeclined = 'ConfirmDeclined',
    ConfirmButtons = 'ConfirmButtons',
}

type InteractiveMessage<
    T extends InteractiveMessageType,
    // eslint-disable-next-line @typescript-eslint/ban-types
    MessageT extends object,
    ExternalState = null
> = BubbleBaseT & { type: T } & MessageT & { externalState?: ExternalState };

export type ConfirmExternalState = {
    isConfirmed: boolean;
};

export type ConfirmMessage = InteractiveMessage<
    InteractiveMessageType.Confirm,
    {
        prompt: string;
        onConfirm: (state: ConfirmExternalState) => void | Promise<void>;
    },
    ConfirmExternalState
>;

export type TerminalExternalState = {
    text: string;
};

export type TerminalMessage = InteractiveMessage<
    InteractiveMessageType.Terminal,
    {
        prompt: string;
        onSend: (state: TerminalExternalState) => void;
    },
    TerminalExternalState
>;

export type AddressInputAccount = {
    address: string;
    balance: string | React.ReactNode;
    description: string;
};

export type AddressInputAccountData = {
    title: string;
    data: AddressInputAccount[];
};

export type AddressInputExternalState = {
    chosenOption: string;
    address: string;
};

export type AddressInputMessage = InteractiveMessage<
    InteractiveMessageType.AddressInput,
    {
        prompt: string;
        onSelect: (state: AddressInputExternalState) => void;
        mainAddress: string;
        mainAddressTitle?: string;
        input: {
            validateAddress: ValidateAddress;
        };
        qrCode: {
            parseData: (data: any) => Promise<string>;
        };
        select: AddressInputAccountData[];
    },
    AddressInputExternalState
>;

type MenuItem = {
    handlerId: number;
    title: string;
    description?: string;
};

export type MenuExternalState = {
    chosenHandlerId: number;
    chosenIndex: number;
};

export type MenuMessage = InteractiveMessage<
    InteractiveMessageType.Menu,
    {
        title: string;
        description?: string;
        items: MenuItem[];
        onSelect: (state: MenuExternalState) => void | Promise<void>;
    },
    MenuExternalState
>;

export type AmountExternalState = {
    amount: BigNumber;
};

export type AmountInputMessage = InteractiveMessage<
    InteractiveMessageType.AmountInput,
    {
        prompt: string;
        decimals: number;
        min: number;
        max: number;
        onSend: (state: AmountExternalState) => void | Promise<void>;
    },
    AmountExternalState
>;

export type BrowserMessage =
    | PlainTextMessage
    | ActionButtonMessage
    | TerminalMessage
    | AddressInputMessage
    | MenuMessage
    | ConfirmMessage
    | AmountInputMessage;
