import * as React from 'react';
import { uiLocalized } from '@tonlabs/localization';
import { getEmptyUIMaterialTextViewRef } from '../MaterialTextView';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView/types';
import type { UISeedPhraseInputState, ValidationResult } from './types';
import { UISeedPhraseInputMessageType } from './consts';

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<UIMaterialTextViewRef>,
): void {
    React.useImperativeHandle<UIMaterialTextViewRef, UIMaterialTextViewRef>(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            ...getEmptyUIMaterialTextViewRef('UISeedPhraseTextView/hooks.ts'),
            ...localRef.current,
        }),
    );
}

const defaultHelper = {
    helperText: undefined,
    error: undefined,
    warning: undefined,
    success: undefined,
};

export function useHelper(
    state: UISeedPhraseInputState,
    isFocused: boolean,
    hasNonLatinCharacters: boolean,
    totalWords: number[],
    validationResult: boolean | ValidationResult,
): {
    helperText: string | undefined;
    error: boolean | undefined;
    warning: boolean | undefined;
    success: boolean | undefined;
} {
    const {
        phrase: { length: insertedPhraseLength },
        parts,
    } = state;

    const enteredWords = React.useMemo(() => parts.filter(w => w.length > 0).length, [parts]);

    const totalWordsString = React.useMemo(() => {
        const lastIndex = totalWords.length - 1;
        return totalWords.reduce((acc, num, index) => {
            if (index === lastIndex) {
                return `${acc}${uiLocalized.localizedStringForValue(num, 'words')}`;
            }

            return `${acc}${num}${uiLocalized.orDelimeter}`;
        }, '');
    }, [totalWords]);

    return React.useMemo(() => {
        if (hasNonLatinCharacters) {
            return {
                ...defaultHelper,
                helperText: uiLocalized.seedPhraseWrongCharacter,
                error: true,
            };
        }
        if (!isFocused && insertedPhraseLength > 0) {
            if (validationResult === true) {
                return {
                    ...defaultHelper,
                    helperText: uiLocalized.greatMemory,
                    success: true,
                };
            }
            if (validationResult === false) {
                return {
                    ...defaultHelper,
                    helperText: uiLocalized.seedPhraseTypo,
                    error: true,
                };
            }
            if (
                !validationResult.type ||
                validationResult.type === UISeedPhraseInputMessageType.Error
            ) {
                return {
                    ...defaultHelper,
                    helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                    error: true,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Success) {
                return {
                    ...defaultHelper,
                    helperText: validationResult?.message ?? uiLocalized.greatMemory,
                    success: true,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Warning) {
                return {
                    ...defaultHelper,
                    helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                    warning: true,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Neutral) {
                return {
                    ...defaultHelper,
                    helperText: validationResult?.message,
                };
            }
        }

        if (enteredWords === 0) {
            return {
                ...defaultHelper,
                helperText: totalWordsString,
            };
        }

        return {
            ...defaultHelper,
            helperText: uiLocalized.localizedStringForValue(enteredWords, 'words'),
        };
    }, [
        hasNonLatinCharacters,
        isFocused,
        insertedPhraseLength,
        enteredWords,
        validationResult,
        totalWordsString,
    ]);
}
