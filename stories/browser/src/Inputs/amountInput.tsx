import * as React from 'react';
import { View } from 'react-native';

import { BubbleSimplePlainText, ChatMessageType, MessageStatus } from '@tonlabs/uistory.chats';
import { Portal } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import type { AmountInputMessage } from '../types';

import { UIAmountInput } from '../UIAmountInput';

export function AmountInput({ onLayout, ...message }: AmountInputMessage) {
    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                {!!message.prompt && (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="amount-input-bubble-prompt"
                        text={message.prompt}
                        status={MessageStatus.Received}
                        firstFromChain
                        lastFromChain
                    />
                )}
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="amount-input-bubble-amount"
                    text={uiLocalized.amountToLocale(
                        message.externalState.amount.dividedBy(10 ** message.decimals),
                    )}
                    status={MessageStatus.Sent}
                    firstFromChain
                    lastFromChain
                />
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            {!!message.prompt && (
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="amount-input-bubble-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />
            )}
            <Portal forId="browser">
                <UIAmountInput
                    decimals={message.decimals}
                    min={message.min}
                    max={message.max}
                    onSendAmount={amount => {
                        message.onSend({
                            amount,
                        });
                    }}
                />
            </Portal>
        </View>
    );
}
