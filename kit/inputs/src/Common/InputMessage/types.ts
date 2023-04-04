import type { InputColorScheme } from '../constants';

export enum InputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
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
     * @default InputColorScheme.Default
     */
    colorScheme?: InputColorScheme;
};

export type InputMessageContainerProps = {
    children: React.ReactNode;
    onPress?: () => void | undefined;
};

export type InputMessageAnimatedContainerProps = {
    children: React.ReactNode;
};
