import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.hydrogen';
import type { OnPressUrl } from '@tonlabs/uikit.chats';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

type UIBrowserProps = {
    messages: BrowserMessage[];
    onPressUrl?: OnPressUrl;
};

export function UIBrowser({ messages, onPressUrl }: UIBrowserProps) {
    return (
        <PortalManager id="browser" renderOnlyLastPortal>
            <UIBrowserList messages={messages} onPressUrl={onPressUrl} />
        </PortalManager>
    );
}
