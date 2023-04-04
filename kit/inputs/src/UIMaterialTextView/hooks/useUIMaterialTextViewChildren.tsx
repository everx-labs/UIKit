import * as React from 'react';
import type { UIMaterialTextViewProps } from '../types';
import { useInputChildren, InputClearButton } from '../../Common/InputChildren';
import { InputColorScheme } from '../../Common';

export function useUIMaterialTextViewChildren(
    children: UIMaterialTextViewProps['children'],
    colorScheme: UIMaterialTextViewProps['colorScheme'] = InputColorScheme.Default,
    hideClearButton: UIMaterialTextViewProps['hideClearButton'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    editable: boolean,
    clear: (() => void) | undefined,
): UIMaterialTextViewProps['children'] {
    const materialTextViewChildren = useInputChildren(children, colorScheme);

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
