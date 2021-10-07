import * as React from 'react';
import { UIDateTimePickerView, UIDateTimePickerType } from '@tonlabs/uikit.flask';

import { UIPullerSheet } from './UIPullerSheet';

export type UIDateTimePickerFullType = UIDateTimePickerType & {
    visible: boolean;
    onClose: () => void;
};

export const UIDateTimePicker = ({
    visible,
    onClose,
    ...dateTimePickerProps
}: UIDateTimePickerFullType) => {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIDateTimePickerView {...dateTimePickerProps} />
        </UIPullerSheet>
    );
};
