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

/**
 * This hook provides hints for user.
 * For example, the number of words, the allowed number of words,
 * whether it contains non-Latin letters.
 */
// export function useHelper(
//     totalWords: number[],
//     hasNonLatinCharacters: boolean,
//     state: UISeedPhraseInputState,
//     isFocused: boolean,
//     isValid: boolean,
// ): { helperText: string | undefined; error: boolean | undefined } {
//     const totalWordsString = React.useMemo(() => {
//         if (typeof totalWords === 'number') {
//             return uiLocalized.localizedStringForValue(totalWords, 'words');
//         }

//         const lastIndex = totalWords.length - 1;
//         return totalWords.reduce((acc, num, index) => {
//             if (index === lastIndex) {
//                 return `${acc}${uiLocalized.localizedStringForValue(num, 'words')}`;
//             }

//             return `${acc}${num}${uiLocalized.orDelimeter}`;
//         }, '');
//     }, [totalWords]);

//     return React.useMemo(() => {
//         if (hasNonLatinCharacters) {
//             return { helperText: uiLocalized.seedPhraseWrongCharacter, error: true };
//         }
//         const entered = state.parts.filter(w => w.length > 0).length;

//         if (!isFocused && state.phrase.length > 0) {
//             if (isValid) {
//                 return { helperText: uiLocalized.greatMemory, error: false };
//             }
//             return { helperText: uiLocalized.seedPhraseTypo, error: true };
//         }

//         if (entered === 0) {
//             return { helperText: totalWordsString, error: false };
//         }

//         return { helperText: uiLocalized.localizedStringForValue(entered, 'words'), error: false };
//     }, [hasNonLatinCharacters, state, isFocused, isValid, totalWordsString]);
// }

export function useHelper(
    state: UISeedPhraseInputState,
    isFocused: boolean,
    validationResult: boolean | ValidationResult,
): {
    helperText: string | undefined;
    error: boolean | undefined;
    warning: boolean | undefined;
    success: boolean | undefined;
} {
    return React.useMemo(() => {
        if (!isFocused && state.phrase.length > 0) {
            if (validationResult === true) {
                return {
                    helperText: uiLocalized.greatMemory,
                    error: undefined,
                    warning: undefined,
                    success: true,
                };
            }
            if (validationResult === false) {
                return {
                    helperText: uiLocalized.seedPhraseTypo,
                    error: true,
                    warning: undefined,
                    success: undefined,
                };
            }
            if (
                !validationResult.type ||
                validationResult.type === UISeedPhraseInputMessageType.Error
            ) {
                return {
                    helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                    error: true,
                    warning: undefined,
                    success: undefined,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Success) {
                return {
                    helperText: validationResult?.message ?? uiLocalized.greatMemory,
                    error: undefined,
                    warning: undefined,
                    success: true,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Warning) {
                return {
                    helperText: validationResult?.message ?? uiLocalized.seedPhraseTypo,
                    error: undefined,
                    warning: true,
                    success: undefined,
                };
            }
            if (validationResult.type === UISeedPhraseInputMessageType.Neutral) {
                return {
                    helperText: validationResult?.message,
                    error: undefined,
                    warning: undefined,
                    success: undefined,
                };
            }
        }

        return { helperText: undefined, error: undefined, warning: undefined, success: undefined };
    }, [state, isFocused, validationResult]);
}
