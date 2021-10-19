import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.hydrogen';
import type { OnPressUrl, OnLongPressText, SafeURLs } from '@tonlabs/uikit.chats';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

type UIBrowserProps = {
    messages: BrowserMessage[];
    onPressUrl?: OnPressUrl;
    onLongPressText?: OnLongPressText;
    safeURLs?: SafeURLs;
};

export function UIBrowser({ messages, onPressUrl, onLongPressText, safeURLs }: UIBrowserProps) {
    return (
        <PortalManager id="browser" renderOnlyLastPortal>
            <UIBrowserList
                messages={messages}
                onPressUrl={onPressUrl}
                onLongPressText={onLongPressText}
                safeURLs={safeURLs}
            />
        </PortalManager>
    );
}
