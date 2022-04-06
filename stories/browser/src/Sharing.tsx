import * as React from 'react';
import { View } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';
import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uistory.chats';

import type { SharingMessage } from './types';

export function Sharing({ onLayout, text, onShare }: SharingMessage) {
    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="sharing-bubble-text"
                text={text}
                status={MessageStatus.Received}
                firstFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="address-input-bubble-select-assets"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.Sharing.Share}
                onPress={onShare}
            />
        </View>
    );
}
