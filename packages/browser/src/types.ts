import type { ChatMessage } from '@tonlabs/uikit.chats';

export type OnSendText = (text: string) => void;
export type OnHeightChange = (height: number) => void;

// eslint-disable-next-line no-shadow
export enum ValidationResultStatus {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    HINT = 'HINT',
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

export type Input = {
    messages: ChatMessage[];
    input: React.ReactNode;
};
