import * as React from 'react';
import { uiLocalized } from '@tonlabs/localization';
import { UISeedPhraseInputMessageType } from '../consts';
import type { ValidationResult, UISeedPhraseInputState } from '../types';

type HelperCredentials = {
    helperText?: string;
    error?: boolean;
    warning?: boolean;
    success?: boolean;
};

function convertValidationResultToHelperCredentials(
    validationResult: boolean | ValidationResult,
): HelperCredentials {
    if (validationResult === true) {
        return {
            helperText: uiLocalized.greatMemory,
            success: true,
        };
    }
    if (validationResult === false) {
        return {
            helperText: uiLocalized.seedPhraseTypo,
            error: true,
        };
    }
    switch (validationResult.type) {
        case UISeedPhraseInputMessageType.Success:
            return {
                helperText: validationResult?.message ?? uiLocalized.greatMemory,
                success: true,
            };
        case UISeedPhraseInputMessageType.Neutral:
            return {
                helperText: validationResult?.message,
            };
        case UISeedPhraseInputMessageType.Warning:
            return {
                helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                warning: true,
            };
        case UISeedPhraseInputMessageType.Error:
        default:
            return {
                helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                error: true,
            };
    }
}

export function useHelperCredentials(
    state: UISeedPhraseInputState,
    isFocused: boolean,
    hasNonLatinCharacters: boolean,
    totalWords: number[],
    validationResult: boolean | ValidationResult,
): HelperCredentials {
    const { parts } = state;

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
        /**
         * There is a wrong character
         */
        if (hasNonLatinCharacters) {
            return {
                helperText: uiLocalized.seedPhraseWrongCharacter,
                error: true,
            };
        }

        /**
         * Nothing to validate
         */
        if (enteredWords === 0) {
            return {
                helperText: totalWordsString,
            };
        }

        /**
         * While the input is in focus we show inserted words count instead of the validation result.
         */
        if (isFocused) {
            return {
                helperText: uiLocalized.localizedStringForValue(enteredWords, 'words'),
            };
        }

        /**
         * Show validation message only when the input is out of focus.
         */
        return convertValidationResultToHelperCredentials(validationResult);
    }, [hasNonLatinCharacters, isFocused, enteredWords, validationResult, totalWordsString]);
}
