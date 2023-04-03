import * as React from 'react';
import type { UIMaterialTextViewProps } from '../types';
import { useInputChildren, InputClearButton } from '../../InputChildren';
import { useInputChildrenColorScheme } from './useInputChildrenColorScheme';

export function useUIMaterialTextViewChildren(
    children: UIMaterialTextViewProps['children'],
    colorScheme: UIMaterialTextViewProps['colorScheme'],
    hideClearButton: UIMaterialTextViewProps['hideClearButton'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    editable: boolean,
    clear: (() => void) | undefined,
): UIMaterialTextViewProps['children'] {
    const inputChildrenColorScheme = useInputChildrenColorScheme(colorScheme);

    const materialTextViewChildren = useInputChildren(children, inputChildrenColorScheme);

    if (hideClearButton) {
        /**
         * If hideClearButton was provided the ClearButton can't be displayed.
         */
        return materialTextViewChildren;
    }

    if (editable && inputHasValue && (isFocused || isHovered)) {
        /**
         * Show the ClearButton and hide other children
         * when some text is shown and the Input is editable and focused or hovered.
         */
        return <InputClearButton clear={clear} />;
    }

    if (!materialTextViewChildren || materialTextViewChildren.length === 0) {
        /**
         * Reserve space for the ClearButton because it may appear.
         */
        return <InputClearButton hiddenButton />;
    }

    /**
     * Show not empty children if the ClearButton is absent.
     */
    return materialTextViewChildren;
}
