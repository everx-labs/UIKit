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
    clear: (() => void) | undefined,
): MaterialTextViewProps['children'] {
    const materialTextViewChildren = useMaterialTextViewChildren(children);

    if (inputHasValue && (isFocused || isHovered)) {
        return <MaterialTextViewClearButton clear={clear} />;
    }

    return materialTextViewChildren;
}
