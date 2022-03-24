import * as React from 'react';
import { Portal } from '@tonlabs/uikit.layout';
import type { UIMenuContainerProps } from './types';
import { UIMenuContainerContent } from './UIMenuContainerContent';

export function UIMenuContainer({ forId, ...uiMenuContainerContentProps }: UIMenuContainerProps) {
    if (!uiMenuContainerContentProps.visible) {
        return null;
    }

    return (
        <Portal absoluteFill forId={forId}>
            <UIMenuContainerContent {...uiMenuContainerContentProps} />
        </Portal>
    );
}
