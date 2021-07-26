import * as React from 'react';
import DatePicker from 'react-native-modern-datepicker';
import { Platform } from 'react-native';

import { UITimePicker } from './UITimePicker';
import { UIDateTimePickerMode, DateTimePickerType } from '../types';

export const UIDateTimePickerView = React.memo(
    ({
        onValueRetrieved,
        minTime,
        maxTime,
        minDate,
        maxDate,
        mode,
        interval,
    }: DateTimePickerType) => {
        const timeZoneOffset = new Date().getTimezoneOffset();

        if (Platform.OS === 'web' && mode === UIDateTimePickerMode.Time) {
            return (
                <UITimePicker
                    {...{ onValueRetrieved, minTime, maxTime, timeZoneOffset }}
                />
            );
        }
        return (
            <DatePicker
                onDateChange={(date: Date) => onValueRetrieved(date)}
                onTimeChange={(time: Date) =>
                    onValueRetrieved(time, timeZoneOffset)
                }
                mode={mode}
                minimumDate={minDate?.toISOString()}
                maximumDate={maxDate?.toISOString()}
                minimumTime={minTime}
                maximumTime={maxTime}
                minuteInterval={interval}
            />
        );
    },
);
