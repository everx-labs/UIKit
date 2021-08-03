import * as React from 'react';
import { UIPullerSheet } from './UIPullerSheet';
import { UIDateTimePickerView, UIDateTimePickerType } from '@tonlabs/uikit.flask';

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
            <UIDateTimePickerView
                {...dateTimePickerProps}
            />
        </UIPullerSheet>
    );
};
