import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DateTimeActionType } from '../types';
import { useDateTimeState } from '../useDateTimeState';

export function validateTime(time: Dayjs | null, min?: Date, max?: Date) {
    if (time == null) {
        return false;
    }
    if (min == null && max == null) {
        return true;
    }
    if (min != null && time.isBefore(min)) {
        return false;
    }
    if (max != null && time.isAfter(max)) {
        return false;
    }
    return true;
}

export function useTime() {
    const {
        state: { selectedDate },
        dispatch,
        min,
        max,
        isAmPmTime,
        isTimeValid,
    } = useDateTimeState();

    const [isAM, setAM] = React.useState(dayjs(selectedDate ?? dayjs()).format('a') === 'am');

    const toggleAmPm = React.useCallback(() => {
        setAM(!isAM);
    }, [isAM]);

    return {
        initialTime: (selectedDate ?? dayjs()).format(isAmPmTime ? 'HH:mm A' : 'HH:mm').slice(0, 5),
        haveValidation: min != null || max != null,
        isValid: isTimeValid,
        set: (hours: number, minutes: number) => {
            // console.log(hours, minutes);
            if (isNaN(hours) || isNaN(minutes) || hours > (isAM ? 12 : 23) || minutes > 59) {
                dispatch({
                    type: DateTimeActionType.Set,
                    payload: {
                        selectedDate: null,
                    },
                });
                return;
            }

            // const hoursNormilized = isAmPmTime ? convertHourTo24(hours, isAM) : hours;

            const newTime = dayjs().hour(hours).minute(minutes).second(0).millisecond(0);

            dispatch({
                type: DateTimeActionType.Set,
                payload: {
                    selectedDate: newTime,
                },
            });
        },
        isAmPmTime,
        isAM,
        toggleAmPm,
    };
}
