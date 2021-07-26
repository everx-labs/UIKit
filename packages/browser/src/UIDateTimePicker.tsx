import * as React from 'react';
import { UIPullerSheet } from './UIPullerSheet';
import { UIDateTimePickerView, DateTimePickerType } from '@tonlabs/uikit.flask';

export type UIDateTimePickerType = DateTimePickerType & {
    visible: boolean;
    onClose: () => void;
};

export const UIDateTimePicker = ({
        visible,
        onClose,
        ...dateTimePickerProps
}: UIDateTimePickerType) => {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIDateTimePickerView
                {...dateTimePickerProps}
            />
        </UIPullerSheet>
    );
};
