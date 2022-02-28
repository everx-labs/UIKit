import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.layout';

import { ShrinkContentUnderSheet } from './ShrinkContentUnderSheet';
import { useIsMobile } from './UIModalSheet';

export function UIModalPortalManager({
    maxMobileWidth,
    children,
}: {
    maxMobileWidth: number;
    children: React.ReactNode;
}) {
    const isMobile = useIsMobile(maxMobileWidth);

    if (!isMobile) {
        return <PortalManager>{children}</PortalManager>;
    }

    return (
        <PortalManager contentWrapperComponent={ShrinkContentUnderSheet}>{children}</PortalManager>
    );
}
