import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';

import type { DateMessage } from '../types';
import { UIDatePicker } from '../UIDatePicker';

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
            <View onLayout={onLayout}>
                {message.externalState.date != null && <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="date-picker-value-bubble-prompt"
                    text={message.externalState.date.toString()}
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />}
            </View>)
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="date-picker-box-bubble-prompt"
                text="Do you want open date picker?"
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="date-picker-bubble-open-picker"
                status={MessageStatus.Received}
                text="Open date picker"
                onPress={() => {
                    dispatch({
                        type: 'OPEN_DATE_PICKER',
                    });
                }}
            />
            <UIDatePicker
                visible={state.pickerVisible}

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
