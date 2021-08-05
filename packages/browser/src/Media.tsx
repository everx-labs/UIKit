import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
    BubbleMedia,
} from '@tonlabs/uikit.chats';

import type { MediaMessage } from './types';

export const Media = (message: MediaMessage) => {
    return (
        <View>
            <BubbleMedia
                {...message}
                type={ChatMessageType.Media}
                key="media-bubble"
            />
            {!!message.prompt && (
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="media-bubble-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                />
            )}
        </View>
    );
};
