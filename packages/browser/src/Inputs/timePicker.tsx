import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';

import type { TimeMessage } from '../types';
import { DateTimePickerMode } from '@tonlabs/uikit.flask';
import { UIDateTimePicker } from '../UIDateTimePicker';

export function TimePicker({ onLayout, ...message }: TimeMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);

    // Messages for test
    if (message.externalState != null) {
        return (
            <>
                <View onLayout={onLayout}>
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="date-picker-box-bubble-prompt"
                        text={message.prompt || "Do you want choose the time?"}
                        status={MessageStatus.Received}
                    />
                    {message.externalState.time != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="time-picker-value-bubble-chosen-time"
                            text={`You've chosen the time: ${message.externalState.time}`}
                            status={MessageStatus.Received}
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
                key="time-picker-box-bubble-prompt"
                text={message.prompt || 'Do you want choose the time?'}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="time-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text="Open the time picker"
                onPress={() => {
                    setPickerVisible(true)
                }}
            />
            <UIDateTimePicker
                visible={isPickerVisible}
                mode={DateTimePickerMode.time}
                minTime={message.minTime}
                maxTime={message.maxTime}
                interval={message.interval}
                timeZoneOffset={message.timeZoneOffsetInMinutes}
                onClose={() => {
                    setPickerVisible(false)
                }}
                onValueRetrieved={(
                    time: Date,
                    timeZoneOffsetInMinutes?: number,
                ) => {
                    message.onSelect({
                        time,
                        timeZoneOffsetInMinutes,
                    });
                    setPickerVisible(false)
                }}
            />
        </View>
    );
}
