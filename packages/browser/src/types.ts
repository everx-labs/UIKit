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

type ConfirmSuccessfulMessage = BubbleBaseT & {
    type: BrowserMessageType.ConfirmSuccessful;
};

type ConfirmDeclinedMessage = BubbleBaseT & {
    type: BrowserMessageType.ConfirmDeclined;
};

export type ConfirmButtonsMessage = BubbleBaseT & {
    type: BrowserMessageType.ConfirmButtons;
    onSuccess: () => void | Promise<void>;
    onDecline: () => void | Promise<void>;
};

export type ConfirmMessage = InteractiveMessage<
    InteractiveMessageType.Confirm,
    {
        prompt: string;
        onConfirm: (isConfirmed: boolean) => void | Promise<void>;
    }
>;

export type TerminalMessage = InteractiveMessage<
    InteractiveMessageType.Terminal,
    {
        prompt: string;
        onSendText: OnSendText;
    }
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

export type MenuMessage = InteractiveMessage<
    InteractiveMessageType.Menu,
    {
        title: string;
        description?: string;
        items: MenuItem[];
        onSelect: (handlerId: number, index: number) => void | Promise<void>;
    }
>;

export type AmountInputMessage = InteractiveMessage<
    InteractiveMessageType.AmountInput,
    {
        prompt: string;
        decimals: number;
        min: number;
        max: number;
        onSendAmount: OnSendAmount;
    }
>;

export type BrowserMessage =
    | PlainTextMessage
    | ActionButtonMessage
    | ConfirmSuccessfulMessage
    | ConfirmDeclinedMessage
    | ConfirmButtonsMessage
    | TerminalMessage
    | AddressInputMessage
    | MenuMessage
    | ConfirmMessage
    | AmountInputMessage;
