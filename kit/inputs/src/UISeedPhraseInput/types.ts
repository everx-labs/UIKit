import type { UIMaterialTextViewProps } from '../UIMaterialTextView';

export type UISeedPhraseInputState = {
    phrase: string;
    parts: string[];
};

export type UISeedPhraseInputProps = {
    onSubmit: () => void | Promise<void>;
    onSuccess: (phrase?: string, parts?: string[]) => void | Promise<void>;
    testID?: string;
    totalWords: number | number[];
    validatePhrase: (phrase?: string, parts?: string[]) => Promise<boolean>;
} & Pick<UIMaterialTextViewProps, 'onFocus' | 'onBlur'>;
