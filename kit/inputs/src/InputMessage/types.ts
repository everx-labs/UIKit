export enum InputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}
export type InputMessageProps = {
    children: string | undefined;
    type: InputMessageType;
    onPress?: () => void | undefined;
};

export type InputMessageContainerProps = {
    children: React.ReactNode;
    onPress?: () => void | undefined;
    message?: string;
};
