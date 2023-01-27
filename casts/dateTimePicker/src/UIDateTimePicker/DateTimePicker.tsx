import React, { useReducer } from 'react';
import { StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { UIBottomSheet, useIntrinsicSizeScrollView } from '@tonlabs/uikit.popups';
import { UINavigationBar } from '@tonlabs/uicast.bars';
import { uiLocalized } from '@tonlabs/localization';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { ScrollView } from '@tonlabs/uikit.scrolls';

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
        case DateTimeActionType.SetDay:
            return {
                ...state,
                selectedDate: state.selectedDate
                    .year(action.selectedDate.year())
                    .month(action.selectedDate.month())
                    .date(action.selectedDate.date()),
                selectedMonth:
                    state.selectedMonth !== action.selectedDate.month()
                        ? action.selectedDate.month()
                        : state.selectedMonth,
                selectedYear:
                    state.selectedYear !== action.selectedDate.year()
                        ? action.selectedDate.year()
                        : state.selectedYear,
            };
        case DateTimeActionType.SetMonth:
            return {
                ...state,
                selectedMonth: action.selectedMonth,
            };
        case DateTimeActionType.SetYear:
            return {
                ...state,
                selectedYear: action.selectedYear,
            };
        case DateTimeActionType.SetTime:
            return {
                ...state,
                selectedTime: action.selectedTime,
            };
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
                    <UIBackgroundView color={ColorVariants.LineTertiary} style={styles.divider} />
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
            return (
                <>
                    <Time />
                </>
            );
    }
}

function DatePickerContent(props: UIDateTimePickerProps) {
    const { defaultDate, isAmPmTime, mode, onClose, min, max } = props;

    const initialDate = React.useMemo(() => {
        const date = dayjs(defaultDate);

        if (min != null && date.isBefore(min)) {
            return dayjs(min);
        }
        if (max != null && date.isAfter(max)) {
            return dayjs(max);
        }

        return date;
    }, [defaultDate, max, min]);

    const [state, dispatch] = useReducer(reducer, {
        isMonthsVisible: false,
        isYearsVisible: false,
        selectedDate: initialDate.hour(0).minute(0).second(0).millisecond(0),
        selectedTime: initialDate.month(0).day(0),
        selectedMonth: initialDate.month(),
        selectedYear: initialDate.year(),
    });

    const isTimeValid = validateTime(state.selectedTime, state.selectedDate, min, max);
    const contextValue = {
        mode,
        min,
        max,
        isAmPmTime: isAmPmTime ?? false,
        state,
        dispatch,
        isTimeValid,
    };

    const { style, onContentSizeChange } = useIntrinsicSizeScrollView();

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
                            if (props.onValueRetrieved && state.selectedTime) {
                                props.onValueRetrieved(
                                    state.selectedDate
                                        .hour(state.selectedTime.hour())
                                        .minute(state.selectedTime.minute())
                                        .toDate(),
                                );
                            }
                        },
                        disabled: !isTimeValid,
                    },
                ]}
            />
            <UIBackgroundView color={ColorVariants.BackgroundTertiary} style={styles.underline} />
            <ScrollView
                containerStyle={style}
                onContentSizeChange={onContentSizeChange}
                keyboardShouldPersistTaps="handled"
            >
                <Content />
            </ScrollView>
        </DateTimeStateProvider>
    );
}

export function DatePicker(props: UIDateTimePickerProps) {
    const { visible, onClose } = props;

    return (
        <UIBottomSheet visible={visible} onClose={onClose} hasDefaultInset hasHeader={false}>
            <DatePickerContent {...props} />
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    underline: {
        height: 1,
    },
    divider: {
        height: 1,
        marginHorizontal: UILayoutConstant.contentOffset,
        marginTop: UILayoutConstant.contentInsetVerticalX4,
    },
});
