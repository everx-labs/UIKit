import * as React from 'react';
import type { UIDateTimePickerType } from './types';
import DatePicker from './UIDateTimePicker';

export const UIDateTimePickerView = React.memo(
    ({
        onValueRetrieved,
        min,
        max,
        mode,
        interval,
        current,
    }: UIDateTimePickerType) => {
        return (
            <DatePicker
                onValueRetrieved={onValueRetrieved}
                mode={mode}
                min={min}
                max={max}
                current={current}
                interval={interval}
            />
        );
    },
);
