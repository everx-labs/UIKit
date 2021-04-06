import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.hydrogen';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

type UIBrowserProps = {
    messages: BrowserMessage[];
};

export function UIBrowser({ messages }: UIBrowserProps) {
    return (
        <PortalManager id="browser" renderOnlyLastPortal>
            <UIBrowserList messages={messages} />
        </PortalManager>
    );
}
