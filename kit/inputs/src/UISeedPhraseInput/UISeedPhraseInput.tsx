import * as React from 'react';
import {
    View,
    Platform,
    NativeSyntheticEvent,
    TextInputSelectionChangeEventData,
    TextInputFocusEventData,
} from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    UIMaterialTextView,
    UIMaterialTextViewRef,
    UIMaterialTextViewProps,
} from '../UIMaterialTextView';

import { useExtendedRef } from './hooks';

const SPLITTER = ` `;

const WORDS_REG_EXP = /[\p{L}\p{N}]+/gu;
const NOT_ENGLISH_LETTERS_REG_EXP = /[^a-zA-Z]/g;

const splitPhrase = (phrase: string) => {
    return phrase.split(SPLITTER);
};

type UISeedPhraseInputState = {
    phrase: string;
    parts: string[];
};
const initialState: UISeedPhraseInputState = {
    phrase: '',
    parts: [],
};
// TODO Remove UILayoutConstant.dashSymbol

export type UISeedPhraseInputProps = {
    onSubmit: () => void | Promise<void>;
    onSuccess: (phrase?: string, parts?: string[]) => void | Promise<void>;
    testID?: string;
    totalWords: number | number[];
    validatePhrase: (phrase?: string, parts?: string[]) => Promise<boolean>;
} & Pick<UIMaterialTextViewProps, 'onFocus' | 'onBlur'>;

export const UISeedPhraseInput = React.forwardRef<UIMaterialTextViewRef, UISeedPhraseInputProps>(
    function UISeedPhraseInputForwarded(props: UISeedPhraseInputProps, ref) {
        const {
            onBlur: onBlurProp,
            onFocus: onFocusProp,
            onSubmit,
            onSuccess,
            testID,
            totalWords: totalWordsProp,
            validatePhrase,
        } = props;
        const totalWords = React.useMemo(() => {
            if (typeof totalWordsProp === 'number') {
                return [totalWordsProp];
            }

            return totalWordsProp;
        }, [totalWordsProp]);

        const textInputRef = React.useRef<UIMaterialTextViewRef>(null);
        const textInputBorderViewRef = React.useRef<View>(null);

        const [state, setState] = React.useState<UISeedPhraseInputState>(initialState);

        useExtendedRef(ref, textInputRef);

        // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
        const phraseRef = React.useRef('');
        const phrasePartsRef = React.useRef<string[] | null>(null);

        const savePhrase = React.useCallback((phrase: string) => {
            phraseRef.current = phrase;
            phrasePartsRef.current = splitPhrase(phrase);

            setState({
                phrase,
                parts: phrasePartsRef.current,
            });
        }, []);

        const [isFocused, setIsFocused] = React.useState(false);

        const onFocus = React.useCallback(
            (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
                setIsFocused(true);

                if (onFocusProp) {
                    onFocusProp(evt);
                }
            },
            [setIsFocused, onFocusProp],
        );

        const onBlur = React.useCallback(
            (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
                // To handle taps on hints we need to delay handling a bit
                // to get a room for event to fire (at least on web)
                // or with isFocused == true hints will be re-rendered before click occur
                setTimeout(() => {
                    // in onHintSelected method we call .focus() to continue typing
                    // so it means we don't need to handle blur event anymore
                    if (textInputRef && textInputRef.current?.isFocused()) {
                        return;
                    }
                    setIsFocused(false);
                }, 50);

                if (onBlurProp) {
                    onBlurProp(evt);
                }
            },
            [textInputRef, onBlurProp],
        );

        const [hasIncorrectCharacters, setHasIncorrectCharacters] = React.useState(false);

        const previousTextRawRef = React.useRef<string | null>(null);

        const onChangeText = React.useCallback(
            (textRaw: string) => {
                /** To prevent onChangeText from being called twice with one actual text change */
                if (previousTextRawRef.current === textRaw) {
                    return;
                }
                previousTextRawRef.current = textRaw;

                // Note: there is an issue with `.toLocaleLowerCase` on Android on some old API version
                // when `Hermes` is used. See issue: https://github.com/facebook/hermes/issues/582
                // The given function returns some incorrect result when applied to an empty string.
                // It was fixed for hermes@0.10.0 which is supposed to be used with react-native@0.67
                // For now we just need to ensure the string is not empty, when applying the function
                const text = textRaw ? textRaw.toLocaleLowerCase() : '';

                const wordList = text.match(WORDS_REG_EXP);

                if (wordList?.join('').match(NOT_ENGLISH_LETTERS_REG_EXP)) {
                    setHasIncorrectCharacters(true);
                } else if (hasIncorrectCharacters) {
                    setHasIncorrectCharacters(false);
                }

                const lastSymbol = text[text.length - 1];

                if (text.length > phraseRef.current.length && lastSymbol === ' ') {
                    // Prevent adding dash when there wasn't typed a word
                    // i.e `word - - `
                    if (text.endsWith('  ')) {
                        textInputRef.current?.changeText(phraseRef.current, false);
                        return;
                    }
                    const parts = text.split(SPLITTER);
                    const newText =
                        parts.length < Math.max.apply(null, totalWords)
                            ? `${text}${UILayoutConstant.dashSymbol} `
                            : text.trim();

                    textInputRef.current?.changeText(newText, false);

                    savePhrase(newText);

                    return;
                }

                if (
                    text.length < phraseRef.current.length &&
                    lastSymbol === UILayoutConstant.dashSymbol
                ) {
                    const newText = text.slice(0, text.length - 2);

                    textInputRef.current?.changeText(newText, false);

                    savePhrase(newText);

                    return;
                }

                let newText = text.match(/(\w+)/g)?.join(SPLITTER) ?? '';

                if (text.endsWith(SPLITTER)) {
                    newText += SPLITTER;
                }

                if (newText !== text) {
                    textInputRef.current?.changeText(newText, false);
                }

                savePhrase(newText);
            },
            [hasIncorrectCharacters, savePhrase, totalWords],
        );

        const [isValid, setIsValid] = React.useState(false);

        // To not call validation at every prop change
        // (and prevent infinite cycles)
        const validatePhraseRef = React.useRef(validatePhrase);
        const onSuccessRef = React.useRef(onSuccess);
        React.useEffect(() => {
            validatePhraseRef.current = validatePhrase;
            onSuccessRef.current = onSuccess;
        }, [validatePhrase, onSuccess]);

        React.useEffect(() => {
            validatePhraseRef.current(state.phrase, state.parts).then(valid => {
                setIsValid(valid);
                if (valid) {
                    onSuccessRef.current(state.phrase, state.parts);
                }
            });
        }, [isValid, setIsValid, state.phrase, state.parts, textInputRef]);

        const onSubmitEditing = React.useCallback(() => {
            textInputRef.current?.changeText(phraseRef.current, false);
            if (isValid) {
                onSubmit && onSubmit();
            }
        }, [isValid, onSubmit, textInputRef]);

        const totalWordsString = React.useMemo(() => {
            if (typeof props.totalWords === 'number') {
                return uiLocalized.localizedStringForValue(props.totalWords, 'words');
            }

            const lastIndex = props.totalWords.length - 1;
            return props.totalWords.reduce((acc, num, index) => {
                if (index === lastIndex) {
                    return `${acc}${uiLocalized.localizedStringForValue(num, 'words')}`;
                }

                return `${acc}${num}${uiLocalized.orDelimeter}`;
            }, '');
        }, [props.totalWords]);

        const hasValue = state.phrase.length > 0;

        const [helperText, error] = React.useMemo(() => {
            if (hasIncorrectCharacters) {
                return [uiLocalized.seedPhraseWrongCharacter, true];
            }
            const entered = state.parts.filter(w => w.length > 0).length;

            if (!isFocused && hasValue) {
                if (isValid) {
                    return [uiLocalized.greatMemory, false];
                }
                return [uiLocalized.seedPhraseTypo, true];
            }

            if (entered === 0) {
                return [totalWordsString, false];
            }

            return [uiLocalized.localizedStringForValue(entered, 'words'), false];
        }, [hasIncorrectCharacters, state.parts, isFocused, hasValue, isValid, totalWordsString]);

        const onSelectionChange = React.useCallback(
            ({
                nativeEvent: {
                    selection: { start, end },
                },
            }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
                // We want to protect seed phrase against copying
                // as it might be occasionally compromised in clipboard
                // NOTE: on android, this resets the input value for an unknown reason
                if (Platform.OS !== 'android' && start !== end) {
                    textInputRef.current?.moveCarret(end);
                }
            },
            [textInputRef],
        );

        return (
            <>
                <UIMaterialTextView
                    ref={textInputRef}
                    borderViewRef={textInputBorderViewRef}
                    testID={testID}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    multiline
                    contextMenuHidden
                    label={uiLocalized.MasterPassword}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSelectionChange={onSelectionChange}
                    helperText={helperText}
                    error={error}
                    success={isValid && !isFocused}
                    returnKeyType="done"
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit
                    noPersonalizedLearning
                />
            </>
        );
    },
);
