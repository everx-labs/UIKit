import React, { useReducer } from 'react';
import { StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { UIBottomSheet, UINavigationBar } from '@tonlabs/uikit.navigation';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { Calendar } from './Calendar/Calendar';
import { DateTimeStateProvider, useDateTimeState } from './useDateTimeState';
import {
    UIDateTimePickerMode,
    UIDateTimePickerProps,
    DateTimeState,
    DateTimeAction,
    DateTimeActionType,
} from './types';
import { Time } from './Time/Time';
import { validateTime } from './Time/useTime';

const reducer = (state: DateTimeState, action: DateTimeAction): DateTimeState => {
    switch (action.type) {
        case DateTimeActionType.Set:
            return { ...state, ...action.payload };
        case DateTimeActionType.ToggleMonths:
            return { ...state, isMonthsVisible: !state.isMonthsVisible };
        case DateTimeActionType.ToggleYears:
            return { ...state, isYearsVisible: !state.isYearsVisible };
        default:
            return state;
    }
};

const headerTitles: Record<UIDateTimePickerMode, string> = {
    [UIDateTimePickerMode.Time]: uiLocalized.DateTimePicker.ChooseTime,
    [UIDateTimePickerMode.Date]: uiLocalized.DateTimePicker.ChooseDate,
    // [UIDateTimePickerMode.MonthYear]: uiLocalized.DateTimePicker.ChooseDate,
    [UIDateTimePickerMode.DateTime]: uiLocalized.DateTimePicker.ChooseDateTime,
};

function Content() {
    const { mode } = useDateTimeState();
    switch (mode) {
        default:
        case UIDateTimePickerMode.DateTime:
            return (
                <>
                    <Calendar />
                    <Time />
                </>
            );
        // TODO!!!!
        // case UIDateTimePickerMode.MonthYear:
        //     return <SelectMonth />;
        case UIDateTimePickerMode.Date:
            return (
                <>
                    <Calendar />
                </>
            );
        case UIDateTimePickerMode.Time:
            return <Time />;
    }
}

function DatePickerContent(props: UIDateTimePickerProps) {
    const { defaultDate, isAmPmTime, mode, onClose, min, max } = props;
    console.log(min, max);
    const selectedDate = defaultDate != null ? dayjs(defaultDate) : dayjs();
    const [state, dispatch] = useReducer(reducer, {
        selectedDate,
        isMonthsVisible: false,
        isYearsVisible: false,
        isTimeValid: validateTime(selectedDate, min, max),
    });

    const contextValue = {
        mode,
        min,
        max,
        isAmPmTime: isAmPmTime ?? false,
        state,
        dispatch,
    };

    return (
        <DateTimeStateProvider value={contextValue}>
            <UINavigationBar
                title={headerTitles[mode]}
                headerLeftItems={[
                    {
                        label: uiLocalized.Cancel,
                        onPress: onClose,
                    },
                ]}
                headerRightItems={[
                    {
                        label: uiLocalized.Done,
                        onPress: () => {
                            console.log(state.selectedDate);
                            if (props.onValueRetrieved) {
                                props.onValueRetrieved(dayjs(state.selectedDate).toDate());
                            }
                        },
                    },
                ]}
            />
            <UIBackgroundView color={ColorVariants.BackgroundTertiary} style={styles.underline} />
            <Content />
        </DateTimeStateProvider>
    );
}

export function DatePicker(props: UIDateTimePickerProps) {
    const { visible, onClose } = props;
    const theme = useTheme();

    return (
        <UIBottomSheet
            style={[
                {
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
            visible={visible}
            onClose={onClose}
        >
            <DatePickerContent {...props} />
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    underline: {
        height: 1,
    },
});
