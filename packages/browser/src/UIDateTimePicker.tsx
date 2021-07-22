import * as React from 'react';
import { UIPullerSheet } from './UIPullerSheet';
import { UIDateTimePickerView, DateTimePickerType } from '@tonlabs/uikit.flask';

export type UIDateTimePickerType = DateTimePickerType & {
    visible: boolean;
    onClose: () => void;
};

export const UIDateTimePicker = ({
    onValueRetrieved,
    minDate,
    maxDate,
    minTime,
    maxTime,
    mode,
    interval,
    visible,
    onClose,
}: UIDateTimePickerType) => {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIDateTimePickerView
                {...{
                    onValueRetrieved,
                    minDate,
                    maxDate,
                    interval,
                    mode,
                    minTime,
                    maxTime,
                }}
            />
        </UIPullerSheet>
    );
};
