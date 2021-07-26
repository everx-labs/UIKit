import * as React from 'react';
import DatePicker from 'react-native-modern-datepicker';

import type { DateTimePickerType } from '../types';

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
