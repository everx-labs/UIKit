import * as React from 'react';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

import { UIPullerSheet } from './UIPullerSheet';

function UIDatePickerContent({onValueRetrieved, minDate, maxDate} : {
    onValueRetrieved: (date: any) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    return (
        <DatePicker
            onSelectedChange={(date: Date) => onValueRetrieved(date)}
            mode="calendar"
            minimumDate={minDate}
            maximumDate={maxDate}
        />
    );
}

export function UIDatePicker({visible, onClose, onValueRetrieved, minDate, maxDate}: {
    visible: boolean;
    onClose: () => void;
    onValueRetrieved: (date: any) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIDatePickerContent onValueRetrieved={onValueRetrieved}  minDate={minDate} maxDate={maxDate} />
        </UIPullerSheet>
    );
}
