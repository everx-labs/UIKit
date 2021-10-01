import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DateTimeActionType } from '../types';
import { useDateTimeState } from '../useDateTimeState';

export function validateTime(time: Dayjs | null, date: Dayjs, min?: Date, max?: Date) {
    if (time == null) {
        return false;
    }
    const d = date.hour(time.hour()).minute(time.minute());
    if (min == null && max == null) {
        return true;
    }
    if (min != null && d.isBefore(min)) {
        return false;
    }
    if (max != null && d.isAfter(max)) {
        return false;
    }
    return true;
}

export function useTime() {
    const {
        state: { selectedTime },
        dispatch,
        min,
        max,
        isAmPmTime,
        isTimeValid,
    } = useDateTimeState();

    const [isAM, setAM] = React.useState(dayjs(selectedTime ?? dayjs()).format('a') === 'am');

    const toggleAmPm = React.useCallback(() => {
        setAM(!isAM);
    }, [isAM]);

    const set = React.useCallback(
        (hours: number, minutes: number) => {
            if (isNaN(hours) || isNaN(minutes) || hours > (isAM ? 12 : 23) || minutes > 59) {
                dispatch({
                    type: DateTimeActionType.SetTime,
                    selectedTime: null,
                });
                return;
            }

            const newTime = dayjs().hour(hours).minute(minutes).second(0).millisecond(0);

            dispatch({
                type: DateTimeActionType.SetTime,
                selectedTime: newTime,
            });
        },
        [dispatch, isAM],
    );

    return {
        initialTime: (selectedTime ?? dayjs()).format(isAmPmTime ? 'HH:mm A' : 'HH:mm').slice(0, 5),
        haveValidation: min != null || max != null,
        isValid: isTimeValid,
        set,
        isAmPmTime,
        isAM,
        toggleAmPm,
    };
}
