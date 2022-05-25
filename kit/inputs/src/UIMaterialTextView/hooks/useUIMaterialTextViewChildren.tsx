import * as React from 'react';
import {
    MaterialTextViewProps,
    MaterialTextViewClearButton,
    useMaterialTextViewChildren,
} from '../../MaterialTextView';

export function useUIMaterialTextViewChildren(
    children: MaterialTextViewProps['children'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    editable: boolean,
    clear: (() => void) | undefined,
): MaterialTextViewProps['children'] {
    const materialTextViewChildren = useMaterialTextViewChildren(children);

    if (editable && inputHasValue && (isFocused || isHovered)) {
        return <MaterialTextViewClearButton clear={clear} />;
    }

    return materialTextViewChildren;
}
