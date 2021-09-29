import React, { createContext, useContext } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { PickerPropsType, PickerActionName } from '../../types';
import type { Utils } from '../utils';

export const CalendarContext = createContext<PickerPropsType<Utils>>({} as PickerPropsType<Utils>);

export const useCalendar = () => {
    return useContext(CalendarContext);
};

function validateTime(time: Dayjs, min?: Date, max?: Date) {
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

export function useTime() {
    const {
        state: { activeDate, time, isTimeValid },
        dispatch,
        min,
        max,
        isAmPmTime,
        utils,
    } = useContext(CalendarContext);

    const initialTime = React.useMemo(() => {
        if (min != null) {
            return dayjs(min);
        }
        if (max != null) {
            return dayjs(max);
        }

        return dayjs(activeDate ?? null);
    }, [activeDate, max, min]);
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
                    type: PickerActionName.Set,
                    payload: {
                        isTimeValid: false,
                    },
                });
                return;
            }

            const hoursNormilized = isAmPmTime ? utils.convertHourTo24(hours, isAM) : hours;

            const newTime = dayjs().hour(hoursNormilized).minute(minutes).second(0).millisecond(0);

            dispatch({
                type: PickerActionName.Set,
                payload: {
                    time: newTime,
                    isTimeValid: validateTime(newTime, min, max),
                },
            });
        },
        isAmPmTime,
        isAM,
        toggleAmPm,
    };
}
