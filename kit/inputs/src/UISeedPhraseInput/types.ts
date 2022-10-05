import type { UIMaterialTextViewProps } from '../UIMaterialTextView';
import type { UISeedPhraseInputMessageType } from './consts';

export type UISeedPhraseInputState = {
    phrase: string;
    parts: string[];
};

export type ValidationResult = {
    /**
     * Type of the message
     */
    type: UISeedPhraseInputMessageType;
    /**
     * Text content of the message
     */
    message: string;
};

export type UISeedPhraseInputProps = {
    /**
     * The number of words that is accepted as a seed phrase
     */
    totalWords: number | number[];
    /**
     * Placeholder of the input
     */
    placeholder?: string;
    /**
     * The async callback that is called on input blur to validate inserted seed phrase.
     * If the callback returns:
     * true - phrase is valid
     * false - phrase is invalid
     * ValidationResult - for the custom message.
     */
    validatePhrase: (phrase?: string, parts?: string[]) => Promise<boolean | ValidationResult>;
    /**
     * The submit callback
     */
    onSubmit: () => void | Promise<void>;
    /**
     * The onSuccess callback
     */
    onSuccess: (phrase?: string, parts?: string[]) => void | Promise<void>;
    /**
     * ID for usage in tests
     */
    testID?: string;
} & Pick<UIMaterialTextViewProps, 'onFocus' | 'onBlur'>;
