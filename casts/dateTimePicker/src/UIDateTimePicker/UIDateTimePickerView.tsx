import * as React from 'react';
import type { UIDateTimePickerProps } from './types';
import { DatePicker } from './DateTimePicker';

export const UIDateTimePickerView = React.memo((props: UIDateTimePickerProps) => {
    return <DatePicker {...props} />;
});
