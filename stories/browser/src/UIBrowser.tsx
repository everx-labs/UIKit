import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.layout';
import { useAutoHandleInsets } from '@tonlabs/uistory.chats';
import type { OnPressUrl, OnLongPressText } from '@tonlabs/uistory.chats';
import { UIInputAccessoryViewAvailability } from '@tonlabs/uicast.keyboard';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';
import { UIBrowserInputOnHeightChangeContext } from './UIBrowserInputHeight';

type UIBrowserProps = {
    messages: BrowserMessage[];
    onPressUrl?: OnPressUrl;
    onLongPressText?: OnLongPressText;
};

export function UIBrowser({ messages, onPressUrl, onLongPressText }: UIBrowserProps) {
    const {
        shouldAutoHandleInsets,
        onInputAccessoryViewAvailable,
        onInputAccessoryViewUnavailable,
        contentInset,
        onHeightChange,
    } = useAutoHandleInsets();

    return (
        <UIInputAccessoryViewAvailability
            onInputAccessoryViewAvailable={onInputAccessoryViewAvailable}
            onInputAccessoryViewUnavailable={onInputAccessoryViewUnavailable}
        >
            <UIBrowserInputOnHeightChangeContext.Provider value={onHeightChange}>
                <PortalManager id="browser" renderOnlyLastPortal>
                    <UIBrowserList
                        messages={messages}
                        onPressUrl={onPressUrl}
                        onLongPressText={onLongPressText}
                        shouldAutoHandleInsets={shouldAutoHandleInsets}
                        contentInset={contentInset}
                    />
                </PortalManager>
            </UIBrowserInputOnHeightChangeContext.Provider>
        </UIInputAccessoryViewAvailability>
    );
}
