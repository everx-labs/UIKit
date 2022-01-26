import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.layout';

import { ShrinkContentUnderSheet } from './ShrinkContentUnderSheet';

export function UIModalPortalManager({ children }: { children: React.ReactNode }) {
    return (
        <PortalManager contentWrapperComponent={ShrinkContentUnderSheet}>{children}</PortalManager>
    );
}
