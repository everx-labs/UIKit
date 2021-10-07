import * as React from 'react';
import { UIDateTimePickerView, UIDateTimePickerProps } from '@tonlabs/uikit.flask';

export const UIDateTimePicker = (props: UIDateTimePickerProps) => {
    return <UIDateTimePickerView {...props} />;
};
