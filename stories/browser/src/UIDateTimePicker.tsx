import * as React from 'react';
import { UIDateTimePickerView, UIDateTimePickerProps } from '@tonlabs/uicast.date-time-picker';

export function UIDateTimePicker(props: UIDateTimePickerProps) {
    return <UIDateTimePickerView {...props} />;
}
