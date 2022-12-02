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

    if (!hideClearButton && editable && inputHasValue && (isFocused || isHovered)) {
        return <MaterialTextViewClearButton clear={clear} />;
    }

    return materialTextViewChildren;
}
