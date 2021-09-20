import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import { uiLocalized } from '@tonlabs/localization';

import { UICountryPicker } from '../UICountryPicker';
import type { CountryMessage } from '../types';

export function CountryPicker({ onLayout, ...message }: CountryMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);

    if (message.externalState != null) {
        return (
            <>
                <View onLayout={onLayout}>
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="country-picker-box-bubble-prompt"
                        text={message.prompt || uiLocalized.CountryPicker.Title}
                        status={MessageStatus.Received}
                    />
                    {message.externalState.value != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="country-picker-value-bubble-chosen-time"
                            text={message.externalState.value}
                            status={MessageStatus.Sent}
                        />
                    )}
                </View>
            </>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="country-picker-box-bubble-prompt"
                text={message.prompt || uiLocalized.CountryPicker.Title}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="country-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text={uiLocalized.Select}
                onPress={() => {
                    setPickerVisible(true);
                }}
            />
            <UICountryPicker
                visible={isPickerVisible}
                onClose={() => {
                    setPickerVisible(false);
                }}
                onSelect={(value: string) => {
                    message.onSelect({
                        value,
                    });
                    setPickerVisible(false);
                }}
            />
        </View>
    );
}
