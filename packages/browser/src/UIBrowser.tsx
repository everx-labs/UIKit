import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.hydrogen';
import type { OnPressUrl, OnLongPressText } from '@tonlabs/uikit.chats';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

type UIBrowserProps = {
    messages: BrowserMessage[];
    onPressUrl?: OnPressUrl;
    onLongPressText?: OnLongPressText;
};

export function UIBrowser({ messages, onPressUrl, onLongPressText }: UIBrowserProps) {
    return (
        <PortalManager id="browser" renderOnlyLastPortal>
            <UIBrowserList messages={messages} onPressUrl={onPressUrl} onLongPressText={onLongPressText} />
        </PortalManager>
    );
}
