import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';

import type { DateMessage } from '../types';
import { UIDateTimePicker, DateTimePickerMode } from '../UIDateTimePicker';

type DatePickerInternalState = {
    pickerVisible: boolean;
};

type DatePickerAction = {
    type:
        | 'OPEN_DATE_PICKER'
        | 'CLOSE_DATE_PICKER'
};

function datePickerReducer(
    state: DatePickerInternalState,
    action: DatePickerAction,
) {
    if (action.type === 'OPEN_DATE_PICKER') {
        return {
            ...state,
            pickerVisible: true,
        };
    }
    if (action.type === 'CLOSE_DATE_PICKER') {
        return {
            ...state,
            pickerVisible: false,
        };
    }

    return {
        pickerVisible: false,
    };
}

export function DatePicker({ onLayout, ...message }: DateMessage) {
    const [state, dispatch] = React.useReducer(datePickerReducer, {
        pickerVisible: false,
    });

    if(message.externalState != null){
        return (
            <>
                {message.externalState.date != null &&
                <View onLayout={onLayout}>
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="date-picker-value-bubble-prompt"
                        text={'You choose the date: ' + message.externalState.date.toString()}
                        status={MessageStatus.Received}
                    />
                </View>}
            </>
            )
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="date-picker-box-bubble-prompt"
                text={message.prompt || "Do you want choose the date?"}
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
                    dispatch({
                        type: 'OPEN_DATE_PICKER',
                    });
                }}
            />
            <UIDateTimePicker
                visible={state.pickerVisible}
                mode={DateTimePickerMode.calendar}
                minDate={message.minDate}
                maxDate={message.maxDate}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_DATE_PICKER',
                    });
                }}
                onValueRetrieved={ (date: Date) => {
                    message.onSelect({
                        date
                    });
                    dispatch({
                        type: 'CLOSE_DATE_PICKER',
                    });
                }}
            />
        </View>
    );
}
