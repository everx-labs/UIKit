export enum InputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}

export enum InputMessageColorScheme {
    Default = 'Default',
    Secondary = 'Secondary',
}

export type InputMessageProps = {
    /**
     * Type of the message.
     * @default InputMessageType.Info
     */
    type: InputMessageType;
    /**
     * Text to display.
     */
    children: string | undefined;
    /**
     * Callback that is called when the text is pressed.
     * Used only for web.
     */
    onPress?: () => void | undefined;
    /**
     * Color scheme of the TextView.
     * @default InputMessageColorScheme.Default
     */
    colorScheme?: InputMessageColorScheme;
};

export type InputMessageContainerProps = {
    children: React.ReactNode;
    onPress?: () => void | undefined;
};

export type InputMessageAnimatedContainerProps = {
    children: React.ReactNode;
};
