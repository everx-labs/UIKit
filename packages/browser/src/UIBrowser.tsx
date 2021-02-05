import * as React from 'react';

import { UIChatList, ChatMessage } from '@tonlabs/uikit.chats';

import { DAddressInput } from './DAddressInput';
import type { OnSendText } from './types';

type UIBrowserProps = {
    messages: ChatMessage[];
    onSendText: OnSendText;
};

export function UIBrowser({ messages, onSendText }: UIBrowserProps) {
    const [bottomInset, setBottomInset] = React.useState<number>(0);

    return (
        <>
            <UIChatList
                areStickersVisible={false}
                onLoadEarlierMessages={() => undefined}
                canLoadMore={false}
                isLoadingMore={false}
                messages={messages}
                bottomInset={bottomInset}
            />
            <DAddressInput
                onSendText={onSendText}
                onHeightChange={setBottomInset}
            />
        </>
    );
}
