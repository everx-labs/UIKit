import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DateTimeActionType } from '../types';
import { useDateTimeState } from '../useDateTimeState';

export function validateTime(time: Dayjs, min?: Date, max?: Date) {
    let i = 0;
    if (min == null && max == null) {
        return true;
    }
    if (min != null && time.isAfter(min)) {
        i += 1;
    }
    if (max != null && time.isBefore(max)) {
        i += 1;
    }
    return i > 0;
}

function convertHourTo24(value: number, isAM: boolean) {
    if (isAM) {
        return value === 12 ? 0 : value;
    }
    return value !== 12 ? value + 12 : value;
}

export function useTime() {
    const {
        state: { selectedDate, isTimeValid },
        dispatch,
        min,
        max,
        isAmPmTime,
    } = useDateTimeState();

    const initialTime = React.useMemo(() => {
        if (min != null) {
            return dayjs(min);
        }
        if (max != null) {
            return dayjs(max);
        }

        return selectedDate;
    }, [selectedDate, max, min]);
    console.log(selectedDate, initialTime, min, max);

    const [isAM, setAM] = React.useState(dayjs(initialTime).format('a') === 'am');

    const toggleAmPm = React.useCallback(() => {
        setAM(!isAM);
    }, [isAM]);

    return {
        initialTime: initialTime.format(isAmPmTime ? 'HH:mm A' : 'HH:mm').slice(0, 5),
        haveValidation: min != null || max != null,
        isValid: isTimeValid,
        set: (hours: number, minutes: number) => {
            if (isNaN(hours) || isNaN(minutes)) {
                dispatch({
                    type: DateTimeActionType.Set,
                    payload: {
                        isTimeValid: false,
                    },
                });
                return;
            }

            const hoursNormilized = isAmPmTime ? convertHourTo24(hours, isAM) : hours;

            const newTime = dayjs().hour(hoursNormilized).minute(minutes).second(0).millisecond(0);

            dispatch({
                type: DateTimeActionType.Set,
                payload: {
                    selectedDate: newTime,
                    isTimeValid: validateTime(newTime, min, max),
                },
            });
        },
        isAmPmTime,
        isAM,
        toggleAmPm,
    };
}
