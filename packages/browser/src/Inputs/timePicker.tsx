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

type TimePickerInternalState = {
    pickerVisible: boolean;
};

type TimePickerAction = {
    type: 'OPEN_TIME_PICKER' | 'CLOSE_TIME_PICKER';
};

function timePickerReducer(
    state: TimePickerInternalState,
    action: TimePickerAction,
) {
    if (action.type === 'OPEN_TIME_PICKER') {
        return {
            ...state,
            pickerVisible: true,
        };
    }
    if (action.type === 'CLOSE_TIME_PICKER') {
        return {
            ...state,
            pickerVisible: false,
        };
    }

    return {
        pickerVisible: false,
    };
}

export function TimePicker({ onLayout, ...message }: TimeMessage) {
    const [state, dispatch] = React.useReducer(timePickerReducer, {
        pickerVisible: false,
    });

    // Messages for test
    if (message.externalState != null) {
        return (
            <>
                <View onLayout={onLayout}>
                    {message.externalState.time != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="time-picker-value-bubble-chosen-time"
                            text={`You choose the time: ${message.externalState.time}`}
                            status={MessageStatus.Received}
                        />
                    )}
                    {message.externalState.timeZoneOffsetInMinutes != null && (
                        <BubbleSimplePlainText
                            type={ChatMessageType.PlainText}
                            key="time-picker-value-bubble-timezone"
                            text={`Your timezone offset: ${
                                message.externalState.timeZoneOffsetInMinutes /
                                60
                            }`}
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
                    dispatch({
                        type: 'OPEN_TIME_PICKER',
                    });
                }}
            />
            <UIDateTimePicker
                visible={state.pickerVisible}
                mode={DateTimePickerMode.time}
                minTime={message.minTime}
                maxTime={message.maxTime}
                interval={message.interval}
                timeZoneOffset={message.timeZoneOffsetInMinutes}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_TIME_PICKER',
                    });
                }}
                onValueRetrieved={(
                    time: Date,
                    timeZoneOffsetInMinutes?: number,
                ) => {
                    message.onSelect({
                        time,
                        timeZoneOffsetInMinutes,
                    });
                    dispatch({
                        type: 'CLOSE_TIME_PICKER',
                    });
                }}
            />
        </View>
    );
}
