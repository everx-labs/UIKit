export enum InputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}
export type InputMessageProps = {
    /**
     * Message to display.
     */
    children: string | undefined;
    /**
     * Type of the message.
     * @default InputMessageType.Info
     */
    type: InputMessageType;
    /**
     * Callback that is called when the message is pressed.
     * Used only for web.
     */
    onPress?: () => void | undefined;
};

export type InputMessageContainerProps = {
    children: React.ReactNode;
    onPress?: () => void | undefined;
};

export type InputMessageAnimatedContainerProps = {
    children: React.ReactNode;
};
