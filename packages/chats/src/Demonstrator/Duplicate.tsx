import * as React from 'react';
import type { DuplicateProps } from './types';
import { DuplicateContent } from './DuplicateContent';

export const Duplicate = (props: DuplicateProps) => {
    const { isOpen } = props;

    if (!isOpen) {
        return null;
    }

    return <DuplicateContent {...props} />;
};
