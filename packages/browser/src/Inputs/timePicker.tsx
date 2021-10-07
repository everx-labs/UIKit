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

import { UIDateTimePicker } from '../UIDateTimePicker';

import type { TimeMessage } from '../types';

export function TimePicker({ onLayout, ...message }: TimeMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);

    if (message.externalState != null) {
        return (
            <>
                <View onLayout={onLayout}>
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="date-picker-box-bubble-prompt"
                        text={
                            message.prompt || uiLocalized.Browser.DateTimeInput.DoYouWantChooseTime
                        }
                        status={MessageStatus.Received}
                    />
                    {message.externalState.time != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="time-picker-value-bubble-chosen-time"
                            text={uiLocalized.formatTime(
                                message.externalState.time,
                                message.isAmPmTime ? 'hh:mm A' : 'HH:mm',
                            )}
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
                text={message.prompt || uiLocalized.Browser.DateTimeInput.DoYouWantChooseTime}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="time-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.DateTimeInput.ChooseTime}
                onPress={() => {
                    setPickerVisible(true);
                }}
            />
            <UIDateTimePicker
                visible={isPickerVisible}
                mode={UIDateTimePickerMode.Time}
                min={message.minTime}
                max={message.maxTime}
                defaultDate={message.currentTime}
                interval={message.interval}
                isAmPmTime={message.isAmPmTime}
                onClose={() => {
                    setPickerVisible(false);
                }}
                onValueRetrieved={(time: Date) => {
                    message.onSelect({
                        time,
                    });
                    setPickerVisible(false);
                }}
            />
        </View>
    );
}
