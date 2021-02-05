import * as React from 'react';

import { UIChatList, ChatMessage } from '@tonlabs/uikit.chats';

import { UIAddressInput } from './UIAddressInput';
import type { OnSendText, ValidateAddress } from './types';

type DAddressInput = {
    type: 'AddressInput';

    validateAddress: ValidateAddress;
};

type Input = DAddressInput;

type UIBrowserProps = {
    messages: ChatMessage[];
    onSendText: OnSendText;

    inputs: Input[];
};

export function UIBrowser({ messages, onSendText, inputs }: UIBrowserProps) {
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
            {inputs.map((input) => {
                if (input.type === 'AddressInput') {
                    return (
                        <UIAddressInput
                            onSendText={onSendText}
                            onHeightChange={setBottomInset}
                            validateAddress={input.validateAddress}
                        />
                        // TODO: put qr code reader here
                    );
                }
                return null;
            })}
        </>
    );
}
