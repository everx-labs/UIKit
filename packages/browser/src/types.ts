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
