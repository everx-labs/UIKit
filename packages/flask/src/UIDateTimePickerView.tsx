import * as React from 'react';
import type { UIDateTimePickerType } from './types';
import DatePicker from './UIDateTimePicker';

export const UIDateTimePickerView = React.memo(
    ({
        onValueRetrieved,
        minimum,
        maximum,
        mode,
        interval,
        current,
    }: UIDateTimePickerType) => {
        return (
            <DatePicker
                onValueRetrieved={onValueRetrieved}
                mode={mode}
                minimum={minimum}
                maximum={maximum}
                current={current}
                interval={interval}
            />
        );
    },
);
