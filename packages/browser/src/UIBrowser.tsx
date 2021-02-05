import * as React from 'react';

import { UIChatList, ChatMessage } from '@tonlabs/uikit.chats';

import { UIAddressInput } from './UIAddressInput';
import type { OnSendText, ValidateAddress } from './types';

type UIBrowserProps = {
    messages: ChatMessage[];
    onSendText: OnSendText;

    validateAddress: ValidateAddress;
};

export function UIBrowser(props: UIBrowserProps) {
    const { messages, onSendText } = props;
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
            <UIAddressInput
                onSendText={onSendText}
                onHeightChange={setBottomInset}
                validateAddress={props.validateAddress}
            />
        </>
    );
}
