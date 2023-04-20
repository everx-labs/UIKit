import * as React from 'react';
import { Portal } from '@tonlabs/uikit.layout';
import type { DuplicateProps } from './types';
import { DuplicateContent } from './DuplicateContent';

export function Duplicate(props: DuplicateProps) {
    const { isOpen } = props;
    if (!isOpen) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <DuplicateContent {...props} />
        </Portal>
    );
}
