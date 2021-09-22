import * as React from 'react';
import { Portal } from '@tonlabs/uikit.layout';
import type { DuplicateProps } from './types';
import { DuplicateContent } from './DuplicateContent';

export const Duplicate = (props: DuplicateProps) => {
    if (!props.isOpen) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <DuplicateContent {...props} />
        </Portal>
    );
};
