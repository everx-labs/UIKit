import * as React from 'react';
import { uiLocalized } from '@tonlabs/localization';
import { getEmptyUIMaterialTextViewRef } from '../MaterialTextView';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView/types';
import type { UISeedPhraseInputState } from './types';

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
    isValid: boolean,
): { helperText: string | undefined; error: boolean | undefined } {
    return React.useMemo(() => {
        if (!isFocused && state.phrase.length > 0) {
            if (isValid) {
                return { helperText: uiLocalized.greatMemory, error: false };
            }
            return { helperText: uiLocalized.seedPhraseTypo, error: true };
        }

        return { helperText: undefined, error: undefined };
    }, [state, isFocused, isValid]);
}
