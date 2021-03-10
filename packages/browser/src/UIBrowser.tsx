import * as React from 'react';

import { PortalManager } from '@tonlabs/uikit.hydrogen';

import { UIBrowserList } from './UIBrowserList';
import type { BrowserMessage } from './types';

type UIBrowserProps = {
    messages: BrowserMessage[];
};

export function UIBrowser({ messages }: UIBrowserProps) {
    const [bottomInset, setBottomInset] = React.useState<number>(0);

    return (
        <PortalManager id="browser">
            <UIBrowserList
                messages={messages}
                bottomInset={bottomInset}
                onHeightChange={setBottomInset}
            />
        </PortalManager>
    );
}
