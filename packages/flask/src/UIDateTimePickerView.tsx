import * as React from 'react';
import DatePicker from 'react-native-modern-datepicker';

import type { UIDateTimePickerType } from './types';

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
            <DatePicker
                onDateChange={onValueRetrieved}
                onTimeChange={onValueRetrieved}
                mode={mode}
                minimumDate={minDate?.toISOString()}
                maximumDate={maxDate?.toISOString()}
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
