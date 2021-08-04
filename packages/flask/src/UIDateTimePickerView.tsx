import * as React from 'react';
import type { UIDateTimePickerType } from './types';
// @ts-ignore
import DatePicker from './UIDateTimePicker';

export const UIDateTimePickerView = React.memo(
    ({
        onValueRetrieved,
        minTime,
        maxTime,
        minDate,
        maxDate,
        mode,
        interval,
        currentDate,
        currentTime,
    }: UIDateTimePickerType) => {

        return (
            // @ts-ignore
            <DatePicker
                onDateChange={onValueRetrieved}
                onTimeChange={onValueRetrieved}
                mode={mode}
                minimumDate={minDate}
                maximumDate={maxDate}
                minimumTime={minTime}
                maximumTime={maxTime}
                currentDate={currentDate}
                currentTime={currentTime}
                minuteInterval={interval}
                // todo: reduce the number of props
            />
        );
    },
);
