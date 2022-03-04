import * as React from 'react';
import { View, Platform } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    UIMaterialTextView,
    UIMaterialTextViewRef,
    UIMaterialTextViewProps,
} from '../UIMaterialTextView';
import { moveCarret } from '../moveCarret';

import { UISeedPhrasePopover } from './UISeedPhrasePopover';

const SPLITTER = ` ${UILayoutConstant.dashSymbol} `;

const identifyWordThatChanged = (phrase: string, lastPhrase: string): [string, number] => {
    const currentWords = phrase.split(SPLITTER);
    const lastWords = lastPhrase.split(SPLITTER);

    for (let i = Math.max(currentWords.length, lastWords.length) - 1; i >= 0; i -= 1) {
        if (lastWords[i] != null && currentWords[i] != null && lastWords[i] !== currentWords[i]) {
            return [currentWords[i], i];
        }
    }

    return ['', -1];
};

const splitPhrase = (phrase: string) => {
    return phrase.split(SPLITTER);
};

type CurrentInnerState = {
    phrase: string;
    parts: string[];
    typed: {
        word: string;
        index: number;
    };
    highlight: {
        index: number;
    };
};

type SEPARATE_ACTION = {
    type: 'separate';
    payload: {
        phrase: string;
        parts?: string[];
    };
};
type REMOVE_SEPARATOR_ACTION = {
    type: 'remove_separator';
    payload: {
        phrase: string;
        parts?: string[];
    };
};
type SET_CURRENT_TYPED_ACTION = {
    type: 'set_currently_typed';
    payload: {
        phrase: string;
        parts?: string[];
    };
};
type CHANGE_HIGHLIGHTED_ACTION = {
    type: 'change_highlighted';
    payload: {
        index: number;
    };
};
type BLUR_ACTION = {
    type: 'blur';
};

type ACTION =
    | SEPARATE_ACTION
    | REMOVE_SEPARATOR_ACTION
    | SET_CURRENT_TYPED_ACTION
    | CHANGE_HIGHLIGHTED_ACTION
    | BLUR_ACTION;

const reducer = (state: CurrentInnerState, action: ACTION): CurrentInnerState => {
    if (action.type === 'separate') {
        return {
            ...state,
            phrase: action.payload.phrase,
            parts: action.payload.parts || splitPhrase(action.payload.phrase),
            typed: {
                word: '',
                index: -1,
            },
            highlight: {
                index: -1,
            },
        };
    }
    if (action.type === 'remove_separator') {
        return {
            ...state,
            phrase: action.payload.phrase,
            parts: action.payload.parts || splitPhrase(action.payload.phrase),
            highlight: {
                index: -1,
            },
        };
    }
    if (action.type === 'set_currently_typed') {
        const [currentWord, currentWordIndex] = identifyWordThatChanged(
            action.payload.phrase,
            state.phrase,
        );
        return {
            ...state,
            phrase: action.payload.phrase,
            parts: action.payload.parts || splitPhrase(action.payload.phrase),
            typed: {
                word: currentWord,
                index: currentWordIndex,
            },
        };
    }
    if (action.type === 'change_highlighted') {
        return {
            ...state,
            highlight: {
                index: action.payload.index,
            },
        };
    }
    if (action.type === 'blur') {
        return {
            ...state,
            highlight: {
                index: -1,
            },
        };
    }

    return state;
};

export type UISeedPhraseTextViewProps = {
    forId?: string;
    onSubmit: () => void | Promise<void>;
    onSuccess: (phrase?: string, parts?: string[]) => void | Promise<void>;
    testID?: string;
    totalWords: number | number[];
    validatePhrase: (phrase?: string, parts?: string[]) => Promise<boolean>;
    words: string[];
} & Pick<UIMaterialTextViewProps, 'onFocus' | 'onBlur'>;

export const UISeedPhraseTextView = React.forwardRef<
    UIMaterialTextViewRef,
    UISeedPhraseTextViewProps
>(function UISeedPhraseTextViewForwarded(props: UISeedPhraseTextViewProps, ref) {
    const {
        forId,
        onBlur: onBlurProp,
        onFocus: onFocusProp,
        onSubmit,
        onSuccess,
        testID,
        totalWords: totalWordsProp,
        validatePhrase,
        words,
    } = props;
    const totalWords = React.useMemo(() => {
        if (typeof totalWordsProp === 'number') {
            return [totalWordsProp];
        }

        return totalWordsProp;
    }, [totalWordsProp]);

    const textInputRef = React.useRef<UIMaterialTextViewRef>(null);
    const textInputBorderViewRef = React.useRef<View>(null);
    const refToUse = ref || textInputRef;

    const [state, dispatch] = React.useReducer(reducer, {
        phrase: '',
        parts: [],
        typed: {
            word: '',
            index: -1,
        },
        highlight: {
            index: -1,
        },
    });
    // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
    const phraseRef = React.useRef('');
    const phrasePartsRef = React.useRef<string[] | null>(null);

    const dispatchAndSavePhrase = React.useCallback((action: ACTION) => {
        if ('payload' in action && action.payload != null && 'phrase' in action.payload) {
            phraseRef.current = action.payload.phrase;
            phrasePartsRef.current = splitPhrase(action.payload.phrase);
            // eslint-disable-next-line no-param-reassign
            action.payload.parts = phrasePartsRef.current;
        }

        dispatch(action);
    }, []);

    const [isFocused, setIsFocused] = React.useState(false);

    const onFocus = React.useCallback(
        evt => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(evt);
            }
        },
        [setIsFocused, onFocusProp],
    );

    const onBlur = React.useCallback(
        evt => {
            // To handle taps on hints we need to delay handling a bit
            // to get a room for event to fire (at least on web)
            // or with isFocused == true hints will be re-rendered before click occur
            setTimeout(() => {
                // in onHintSelected method we call .focus() to continue typing
                // so it means we don't need to handle blur event anymore
                if (refToUse && 'current' in refToUse && refToUse.current?.isFocused()) {
                    return;
                }
                dispatch({
                    type: 'blur',
                });
                setIsFocused(false);
            }, 50);

            if (onBlurProp) {
                onBlurProp(evt);
            }
        },
        [refToUse, onBlurProp],
    );

    const hints = React.useMemo(() => {
        if (!isFocused) {
            return [];
        }
        if (state.typed.word.length === 0) {
            return [];
        }
        const filtered = words.filter(word => word.indexOf(state.typed.word) === 0);

        // Do not show hint if it consist of the typed word itself
        if (filtered.length === 1 && filtered[0] === state.typed.word) {
            return [];
        }

        return filtered;
    }, [words, state.typed.word, isFocused]);

    const onHintSelected = React.useCallback(
        (item: string) => {
            const parts = phrasePartsRef.current ? [...phrasePartsRef.current] : [];

            parts[state.typed.index] = item;

            let newText = parts.join(SPLITTER);

            if (state.typed.index === parts.length - 1 && totalWords.indexOf(parts.length) === -1) {
                newText = `${newText}${SPLITTER}`;
            }

            if (refToUse && 'current' in refToUse) {
                // Now change the text for the input
                if (Platform.OS === 'android') {
                    // Actually Android moves the cursor to the the right visually,
                    // BUT physically it's not moved, and when the user continues typing
                    // the cursor stays wherever it was before, but not at the right.
                    // N.B. This bug is reproducible on NOT all Android devices, but some!!!

                    /*
                    At the moment the hack bellow behaves even more terrible then the issue above,
                    because a native selection of Android's TextInput gets stuck since RN0.60:
                    https://github.com/facebook/react-native/issues/26047

                    // Thus we change the native position of it ...
                    refToUse.current?.setNativeProps({
                        selection: {
                            start: newText.length - 1,
                            end: newText.length - 1,
                        },
                    });
                    // ... in order to return it back to the right
                    refToUse.current?.setNativeProps({
                        selection: {
                            start: newText.length,
                            end: newText.length,
                        },
                    });
                    */

                    // Another hack...
                    // Remove the ending space in order to force the input updating its cursor
                    // (This should not affect the UX when selecting hints)
                    refToUse.current?.setNativeProps({
                        text: newText.substr(0, newText.length - 1),
                    });

                    // Now move the cursor position back to the end
                    requestAnimationFrame(() => {
                        refToUse.current?.setNativeProps({
                            text: newText,
                        });
                    });
                } else {
                    // The rest platforms behave properly
                    refToUse.current?.changeText(newText, false);
                }

                // Focus the input in case the focus was lost on a hint selection
                refToUse.current?.focus();
            }

            dispatchAndSavePhrase({
                type: 'separate',
                payload: {
                    phrase: newText,
                },
            });
        },
        [totalWords, state.typed.index, dispatchAndSavePhrase, refToUse],
    );

    const onHighlightedItemIndexChange = React.useCallback((index: number) => {
        dispatch({
            type: 'change_highlighted',
            payload: {
                index,
            },
        });
    }, []);

    const onKeyPress = React.useCallback(
        (e: any) => {
            const event = e.nativeEvent;

            if (event.key === 'ArrowUp') {
                e.preventDefault();
                dispatch({
                    type: 'change_highlighted',
                    payload: {
                        index: Math.max(state.highlight.index - 1, 0),
                    },
                });

                return;
            }
            if (event.key === 'ArrowDown') {
                e.preventDefault();
                dispatch({
                    type: 'change_highlighted',
                    payload: {
                        index: Math.min(state.highlight.index + 1, hints.length - 1),
                    },
                });

                return;
            }
            if (event.key === 'Enter' && state.highlight.index >= 0) {
                const item = hints[state.highlight.index];
                // If nothing is selected treat as a usual submit
                if (item == null) {
                    return;
                }
                e.preventDefault();
                onHintSelected(item);
            }
        },
        [hints, state.highlight.index, onHintSelected],
    );

    const onChangeText = React.useCallback(
        (text: string) => {
            const lastSymbol = text[text.length - 1];

            if (text.length > phraseRef.current.length && lastSymbol === ' ') {
                // Prevent adding dash when there wasn't typed a word
                // i.e `word - - `
                if (text.endsWith('  ')) {
                    if (refToUse && 'current' in refToUse) {
                        refToUse.current?.setNativeProps({
                            text: phraseRef.current,
                        });
                    }
                    return;
                }
                const parts = text.split(SPLITTER);
                const newText =
                    parts.length < Math.max.apply(null, totalWords)
                        ? `${text}${UILayoutConstant.dashSymbol} `
                        : text.trim();

                if (refToUse && 'current' in refToUse) {
                    refToUse.current?.changeText(newText, false);
                }

                dispatchAndSavePhrase({
                    type: 'separate',
                    payload: { phrase: newText },
                });

                return;
            }

            if (
                text.length < phraseRef.current.length &&
                lastSymbol === UILayoutConstant.dashSymbol
            ) {
                const newText = text.slice(0, text.length - 2);

                if (refToUse && 'current' in refToUse) {
                    refToUse.current?.changeText(newText, false);
                }

                dispatchAndSavePhrase({
                    type: 'remove_separator',
                    payload: { phrase: newText },
                });

                return;
            }

            const newText = text.match(/(\w+)/g)?.join(SPLITTER) ?? '';

            if (newText !== text && refToUse && 'current' in refToUse) {
                refToUse.current?.changeText(newText, false);
            }

            dispatchAndSavePhrase({
                type: 'set_currently_typed',
                payload: { phrase: newText },
            });
        },
        [totalWords, dispatchAndSavePhrase, refToUse],
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
    }, [isValid, setIsValid, state.phrase, state.parts, refToUse]);

    const onSubmitEditing = React.useCallback(() => {
        if (refToUse && 'current' in refToUse) {
            refToUse.current?.changeText(phraseRef.current, false);
        }
        if (isValid) {
            onSubmit && onSubmit();
        }
    }, [isValid, onSubmit, refToUse]);

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
    }, [isFocused, isValid, hasValue, state.parts, totalWordsString]);

    const onSelectionChange = React.useCallback(
        ({
            nativeEvent: {
                selection: { start, end },
            },
        }) => {
            // We want to protect seed phrase against copying
            // as it might be occasionally compromised in clipboard
            if (Platform.OS !== 'ios' && start !== end) {
                moveCarret(refToUse, state.phrase.length);
            }
        },
        [state, refToUse],
    );

    const [height, setHeight] = React.useState(0);
    const onHeightChange = React.useCallback(
        (newHeight: number) => {
            setHeight(newHeight);
        },
        [setHeight],
    );

    return (
        <>
            <UIMaterialTextView
                ref={refToUse}
                borderViewRef={textInputBorderViewRef}
                testID={testID}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                multiline
                contextMenuHidden
                label={uiLocalized.MasterPassword}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
                onSelectionChange={onSelectionChange}
                helperText={helperText}
                error={error}
                success={isValid && !isFocused}
                returnKeyType="done"
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit
                onHeightChange={onHeightChange}
                noPersonalizedLearning
            />
            <UISeedPhrasePopover
                // if number of lines changed, redraw it
                forId={forId}
                key={height}
                elementRef={textInputBorderViewRef}
                currentHighlightedItemIndex={state.highlight.index}
                onHighlightedItemIndexChange={onHighlightedItemIndexChange}
                hints={hints}
                onHintSelected={onHintSelected}
            />
        </>
    );
});
