import type { ChatMessageType, BubbleBaseT } from '@tonlabs/uikit.chats';
import type BigNumber from 'bignumber.js';
import type React from 'react';

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
    SigningBox = 'SigningBox',
    EncryptionBox = 'EncryptionBox',
    TransactionConfirmation = 'TransactionConfirmation',
    QRCode = 'QRCode',
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
        min?: BigNumber;
        max?: BigNumber;
        onSend: (state: AmountExternalState) => void | Promise<void>;
    },
    AmountExternalState
>;

export type SigningBox = {
    /**
     * Id of the signature, e.g. may be equal to SigningBox handler
     */
    id: number;
    /**
     * Title of the signature
     */
    title: string;
    /**
     * Optional public key of the signature (e.g. for the security card it might be unavailable)
     */
    publicKey?: string;
    /**
     * Optional serial number of the security card used for the signature
     */
    serialNumber?: string,
};

export type SigningBoxExternalState = {
    chosenOption?: string;
    signingBox?: SigningBox;
};

export type SigningBoxMessage = InteractiveMessage<
    InteractiveMessageType.SigningBox,
    {
        prompt?: string;
        signingBoxes: SigningBox[];
        securityCardSupported?: boolean;
        /* in case of a manual enter */
        onAddSigningBox: (privateKey: string) => Promise<SigningBox>;
        onUseSecurityCard: () => Promise<boolean>;
        onSelect: (state: SigningBoxExternalState) => void;
    },
    SigningBoxExternalState
>;

export type EncryptionBox = {
    id: number;
    title: string;
};

export type EncryptionBoxExternalState = {
    chosenOption?: string;
    encryptionBox?: EncryptionBox;
};

export type EncryptionBoxMessage = InteractiveMessage<
    InteractiveMessageType.EncryptionBox,
    {
        prompt?: string;
        encryptionBoxes: EncryptionBox[];
        /* in case of a manual enter */
        onAddEncryptionBox: (privateKey: string) => Promise<EncryptionBox>;
        onSelect: (state: EncryptionBoxExternalState) => void;
    },
    EncryptionBoxExternalState
>;

export type TransactionConfirmationExternalState = {
    status: 'approved' | 'cancelled';
};

export type TransactionConfirmationMessage = InteractiveMessage<
    InteractiveMessageType.TransactionConfirmation,
    {
        toAddress?: string;
        onAddressPress?: () => void | Promise<void>;
        recipientsCount?: number;
        totalAmount: string | React.ReactElement<any, any>;
        fees: string | React.ReactElement<any, any>;
        signature: SigningBox;
        onApprove: (
            externalState: TransactionConfirmationExternalState,
        ) => void | Promise<void>;
        onCancel: (
            externalState: TransactionConfirmationExternalState,
        ) => void | Promise<void>;
        isDangerous?: boolean;
    },
    TransactionConfirmationExternalState
>;

export type QRCodeExternalState = {
    value: string;
};

export type QRCodeMessage = InteractiveMessage<
    InteractiveMessageType.QRCode,
    {
        onScan: (state: QRCodeExternalState) => void;
        parseData: (data: any) => Promise<string>;
        fastScan?: boolean,
    },
    QRCodeExternalState
>;

export type BrowserMessage =
    | PlainTextMessage
    | ActionButtonMessage
    | TerminalMessage
    | AddressInputMessage
    | MenuMessage
    | ConfirmMessage
    | AmountInputMessage
    | SigningBoxMessage
    | EncryptionBoxMessage
    | TransactionConfirmationMessage
    | QRCodeMessage;

type WithExternalStateHelper<A> = A extends { externalState?: any } ? A : never;

export type ExternalState = WithExternalStateHelper<
    BrowserMessage
>['externalState'];
