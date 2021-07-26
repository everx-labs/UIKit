import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';

import { DateTimePickerMode } from '@tonlabs/uikit.flask';

import { UIDateTimePicker } from '../UIDateTimePicker';

import type { DateMessage } from '../types';

export function DatePicker({ onLayout, ...message }: DateMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);

    if (message.externalState != null) {
        return (
            <>
                {message.externalState.date != null && (
                    <View onLayout={onLayout}>
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="date-picker-box-bubble-prompt"
                            text={message.prompt || "Do you want choose the dates?"}
                            status={MessageStatus.Received}
                        />
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="date-picker-value-bubble-prompt"
                            text={`You've chosen the date: ${message.externalState.date.toString()}`}
                            status={MessageStatus.Received}
                        />
                    </View>
                )}
            </>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="date-picker-box-bubble-prompt"
                text={message.prompt || 'Do you want choose the date?'}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="date-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text="Open the date picker"
                onPress={() => {
                    setPickerVisible(true)
                }}
            />
            <UIDateTimePicker
                visible={isPickerVisible}
                mode={DateTimePickerMode.calendar}
                minDate={message.minDate}
                maxDate={message.maxDate}
                onClose={() => {
                    setPickerVisible(false)
                }}
                onValueRetrieved={(date: Date) => {
                    message.onSelect({
                        date,
                    });
                    setPickerVisible(false)
                }}
            />
        </View>
    );
}
