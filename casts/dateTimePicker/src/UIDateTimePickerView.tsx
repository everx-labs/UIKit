import * as React from 'react';
import type { UIDateTimePickerType } from './types';
import DatePicker from './UIDateTimePicker';

export const UIDateTimePickerView = React.memo((props: UIDateTimePickerType) => {
    return <DatePicker {...props} />;
});
