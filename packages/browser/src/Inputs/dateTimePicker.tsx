import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';

import { UIDateTimePickerMode } from '@tonlabs/uikit.flask';

import { uiLocalized } from '@tonlabs/uikit.localization';
import type { DateTimeMessage } from '../types';
import { UIDateTimePicker } from '../UIDateTimePicker';

export function DateTimePicker({ onLayout, ...message }: DateTimeMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);

    if (message.externalState != null) {
        return (
            <>
                <View onLayout={onLayout}>
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="date-picker-box-bubble-prompt"
                        text={
                            message.prompt ||
                            uiLocalized.Browser.DateTimeInput.DoYouWantChooseDateTime
                        }
                        status={MessageStatus.Received}
                    />
                    {message.externalState.datetime != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="time-picker-value-bubble-chosen-time"
                            text={uiLocalized.formatDate(message.externalState.datetime)}
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
                key="time-picker-box-bubble-prompt"
                text={message.prompt || uiLocalized.Browser.DateTimeInput.DoYouWantChooseDateTime}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="time-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.DateTimeInput.ChooseDateTime}
                onPress={() => {
                    setPickerVisible(true);
                }}
            />
            <UIDateTimePicker
                visible={isPickerVisible}
                mode={UIDateTimePickerMode.DateTime}
                min={message.minDateTime}
                max={message.maxDateTime}
                defaultDate={message.current}
                interval={message.interval}
                isAmPmTime={message.isAmPmTime}
                onClose={() => {
                    setPickerVisible(false);
                }}
                onValueRetrieved={(datetime: Date) => {
                    message.onSelect({
                        datetime,
                    });
                    setPickerVisible(false);
                }}
            />
        </View>
    );
}
