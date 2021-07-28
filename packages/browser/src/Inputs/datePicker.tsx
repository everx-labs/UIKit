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

import type { DateMessage } from '../types';

export function DatePicker({ onLayout, ...message }: DateMessage) {
    const [isPickerVisible, setPickerVisible] = React.useState(false);
    if (message.externalState != null) {

                if(message.externalState.date !== undefined){


                    return(
                        <View onLayout={onLayout}>
                            <BubbleSimplePlainText
                                type={ChatMessageType.PlainText}
                                key="date-picker-box-bubble-prompt"
                                text={
                                    message.prompt || uiLocalized.Browser.DateTimeInput.DoYouWantChooseTheDate
                                }
                                status={MessageStatus.Received}
                        />
                            <BubbleSimplePlainText
                                type={ChatMessageType.PlainText}
                                key="date-picker-value-bubble-prompt"
                                text={uiLocalized.formatString(uiLocalized.Browser.DateTimeInput.YouHaveChosenTheDate + uiLocalized.formatDate(message.externalState.date))}
                                status={MessageStatus.Received}
                        />
                        </View>
                )}
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="date-picker-box-bubble-prompt"
                text={
                    message.prompt ||
                    uiLocalized.Browser.DateTimeInput.DoYouWantChooseTheDate
                }
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="date-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.DateTimeInput.ChooseDate}
                onPress={() => {
                    setPickerVisible(true);
                }}
            />
            <UIDateTimePicker
                visible={isPickerVisible}
                mode={UIDateTimePickerMode.Date}
                minDate={message.minDate}
                maxDate={message.maxDate}
                currentDate={message.currentDate}
                onClose={() => {
                    setPickerVisible(false);
                }}
                onValueRetrieved={(date: Date) => {
                    message.onSelect({
                        date,
                    });
                    setPickerVisible(false);
                }}
            />
        </View>
    );
}
