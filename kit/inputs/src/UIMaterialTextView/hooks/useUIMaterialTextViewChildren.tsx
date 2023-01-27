import * as React from 'react';
import { MaterialTextViewClearButton, useMaterialTextViewChildren } from '../../MaterialTextView';
import type { UIMaterialTextViewProps } from '../types';

export function useUIMaterialTextViewChildren(
    children: UIMaterialTextViewProps['children'],
    hideClearButton: UIMaterialTextViewProps['hideClearButton'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    editable: boolean,
    clear: (() => void) | undefined,
): UIMaterialTextViewProps['children'] {
    const materialTextViewChildren = useMaterialTextViewChildren(children);

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
        return <MaterialTextViewClearButton clear={clear} />;
    }

    if (!materialTextViewChildren || materialTextViewChildren.length === 0) {
        /**
         * Reserve space for the ClearButton because it may appear.
         */
        return <MaterialTextViewClearButton hiddenButton />;
    }

    /**
     * Show not empty children if the ClearButton is absent.
     */
    return materialTextViewChildren;
}
