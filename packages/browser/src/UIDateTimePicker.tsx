import * as React from 'react';
import {Platform} from "react-native";
// @ts-ignore
import {DatePicker as MobileDatePicker} from 'react-native-modern-datepicker';
//import "react-modern-calendar-datepicker/lib/DatePicker.css"; //todo: move to web component, uncomment for web ver
import {Calendar} from 'react-modern-calendar-datepicker';

import { UIPullerSheet } from './UIPullerSheet';

export enum DateTimePickerMode {
    calendar = 'calendar',
    time = 'time',
}

type DateTimePickerType = {
    visible: boolean;
    onClose: () => void;
    onValueRetrieved: (date: Date,  timezone?: number) => void;
    minDate?: Date;
    maxDate?: Date;
    minTime?: Date;
    maxTime?: Date;
    timeZoneOffset?: number;
    interval?: number;
    mode: DateTimePickerMode;
}

function DateTimePicker({onValueRetrieved, minDate, maxDate, minTime, maxTime, mode, interval}: DateTimePickerType) {

    const timeZoneOffsetInMinutes: number = new Date().getTimezoneOffset();

    function returnDateObject(date: Date | undefined) {
        if(date){
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDay(),
            }
        } else {
            return undefined
        }
    }

    function returnValue(date: any){
        if(date){
            let newDate: Date;
            if(Platform.OS === 'web'){
                newDate = new Date(date.year, date.month, date.day);
            } else {
                newDate = new Date(date)
            }
            mode === DateTimePickerMode.calendar
                ? onValueRetrieved(newDate)
                : onValueRetrieved(newDate, timeZoneOffsetInMinutes)

        }
    }

    if (Platform.OS === 'web') {
        return <Calendar
                    onChange={returnValue}
                    minimumDate={returnDateObject(minDate)}
                    maximumDate={returnDateObject(maxDate)}
                />
                // todo: create time picker for web and move to another place(?)
    } else {
        return <MobileDatePicker
                    onSelectedChange={returnValue}
                    mode={mode}
                    minimumDate={minDate?.toISOString()}
                    maximumDate={maxDate?.toISOString()}
                    minuteInterval={interval}
                    selected={new Date().toISOString()}
                    //timeZoneOffset={timeZoneOffset}
                    // No min/max time and timezoneoffset in this lib now
                    // todo: add min/max time and timeZoneOffset
                />
    }

}

export function UIDateTimePicker(props: DateTimePickerType) {

    return (
        <UIPullerSheet visible={props.visible} onClose={props.onClose}>
            <DateTimePicker
                {...props}
            />
        </UIPullerSheet>
    );
}
