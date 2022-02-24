import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.layout';
import { useShouldAutoHandleInsets } from '@tonlabs/uistory.chats';
import type { OnPressUrl, OnLongPressText } from '@tonlabs/uistory.chats';
import { UIInputAccessoryViewAvailability } from '@tonlabs/uikit.inputs';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

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
    } = useShouldAutoHandleInsets();
    return (
        <UIInputAccessoryViewAvailability
            onInputAccessoryViewAvailable={onInputAccessoryViewAvailable}
            onInputAccessoryViewUnavailable={onInputAccessoryViewUnavailable}
        >
            <PortalManager id="browser" renderOnlyLastPortal>
                <UIBrowserList
                    messages={messages}
                    onPressUrl={onPressUrl}
                    onLongPressText={onLongPressText}
                    shouldAutoHandleInsets={shouldAutoHandleInsets}
                />
            </PortalManager>
        </UIInputAccessoryViewAvailability>
    );
}
