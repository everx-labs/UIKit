import * as React from 'react';
import { getEmptyUIMaterialTextViewRef } from '../MaterialTextView';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView/types';

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
