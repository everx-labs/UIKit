import * as React from 'react';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';
// bad lib, temporary solution

import { UIPullerSheet } from './UIPullerSheet';

function UIDatePickerContent({
                                 onKeyRetrieved,
                                 minDate,
                                 maxDate
                           }: {
    onKeyRetrieved: (date: any) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    return (
        <DatePicker
            //onSelectedChange={onKeyRetrieved}
            mode="calendar"
            minimumDate={minDate}
            maximumDate={maxDate}
        />
    );
}

export function UIDatePicker({
                               visible,
                               onClose,
                                 onKeyRetrieved,
                               minDate,
                               maxDate
                           }: {
    visible: boolean;
    onClose: () => void;
    onKeyRetrieved: (date: any) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIDatePickerContent onKeyRetrieved={onKeyRetrieved}  minDate={minDate} maxDate={maxDate} />
        </UIPullerSheet>
    );
}
