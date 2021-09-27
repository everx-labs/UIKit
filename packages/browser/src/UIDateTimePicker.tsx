import * as React from 'react';
import { UIDateTimePickerView, UIDateTimePickerType } from '@tonlabs/uikit.flask';

export const UIDateTimePicker = (props: UIDateTimePickerType) => {
    return <UIDateTimePickerView {...props} />;
};
