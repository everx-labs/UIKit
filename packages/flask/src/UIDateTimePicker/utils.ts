import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { uiLocalized } from '@tonlabs/uikit.localization';
import type { PickerPropsType, UIDateTimePickerType } from '../types';

class Utils {
    private readonly data: {
        max: Date | undefined;
        min: Date | undefined;
    };

    private readonly config: {
        selectedFormat: string;
        monthYearFormat: string;
        hour: string;
        dateFormat: string;
        timeFormat: string;
        dayNames: string[];
        dayNamesShort: string[];
        timeClose: string;
        timeSelect: string;
        monthNames: string[];
        minute: string;
    };

    constructor({ min, max, mode }: UIDateTimePickerType & PickerPropsType) {
        this.data = {
            min,
            max,
        };
        this.config = {
            dayNames: Object.values(uiLocalized.DateTimePicker.dayNames),
            dayNamesShort: Object.values(uiLocalized.DateTimePicker.dayNamesShort),
            monthNames: Object.values(uiLocalized.DateTimePicker.monthNames),
            selectedFormat: 'YYYY/MM/DD',
            dateFormat: 'YYYY/MM/DD',
            monthYearFormat: 'YYYY MM',
            timeFormat: 'HH:mm',
            hour: uiLocalized.DateTimePicker.hour,
            minute: uiLocalized.DateTimePicker.minute,
            timeSelect: uiLocalized.DateTimePicker.select,
            timeClose: uiLocalized.DateTimePicker.close,
        };
        if (mode === 'time' || mode === 'datepicker') {
            this.config.selectedFormat = `${this.config.dateFormat} ${this.config.timeFormat}`;
        }
    }

    get flexDirection() {
        return {
            flexDirection: 'row',
        };
    }

    getFormatted = (date: any, formatName: string = 'selectedFormat') =>
        // @ts-expect-error
        date.format(this.config[formatName]);

    getFormattedDate = (date = new Date(), format = 'YYYY/MM/DD') => dayjs(date).format(format);

    getTime = (time: Date) => this.getDate(time).format(this.config.timeFormat);

    getToday = () => this.getFormatted(new Date(), 'dateFormat');

    getMonthName = (month: number) => this.config.monthNames[month];

    getDate = (time: dayjs.ConfigType | undefined) => dayjs(time);

    getMonthYearText = (time: dayjs.ConfigType | undefined) => {
        const date = dayjs(time);
        const year = date.year();
        const month = this.getMonthName(date.month());
        return `${month} ${year}`;
    };

    checkMonthDisabled = (time: dayjs.ConfigType | undefined) => {
        const { min, max } = this.data;
        const date = dayjs(time);
        let disabled = false;
        if (min) {
            const lastDayInMonth = date.date(date.daysInMonth());
            disabled = lastDayInMonth.startOf('hour') < dayjs(min).startOf('hour');
        }
        if (max && !disabled) {
            const firstDayInMonth = date.date(1);
            disabled = firstDayInMonth.startOf('hour') > dayjs(max).startOf('hour');
        }
        return disabled;
    };

    checkArrowMonthDisabled = (time: dayjs.ConfigType | undefined, next: any) => {
        const date = dayjs(time);
        return this.checkMonthDisabled(date.add(next ? -1 : 1, 'month'));
    };

    checkYearDisabled = (year: number, next: any) => {
        const { min, max } = this.data;
        const y = dayjs(next ? max : min).year();
        return next ? year >= y : year <= y;
    };

    checkSelectMonthDisabled = (time: dayjs.ConfigType | undefined, month: number) => {
        const date = dayjs(time);
        const dateWithNewMonth = date.month(month);
        return this.checkMonthDisabled(dateWithNewMonth);
    };

    validYear = (time: dayjs.ConfigType | undefined, year: number) => {
        const { min, max } = this.data;
        const date = dayjs(time).year(year);
        let validDate = this.getDate(date);
        if (min && date < dayjs(min)) {
            validDate = dayjs(min);
        }
        if (max && date > dayjs(max)) {
            validDate = dayjs(max);
        }
        return validDate;
    };

    getMonthDays = (time: dayjs.ConfigType | undefined) => {
        const { min, max } = this.data;
        let date = dayjs(time);
        const currentMonthDays = date.daysInMonth();
        const firstDay = date.date(1);
        const dayOfMonth = firstDay.day() % 7;
        return [
            ...new Array(dayOfMonth),
            ...[...new Array(currentMonthDays)].map((_, n) => {
                let disabled = false;
                const thisDay = date.date(n + 1);
                if (min) {
                    disabled = thisDay.startOf('hour') < this.getDate(min).startOf('hour');
                }
                if (max && !disabled) {
                    disabled = thisDay.startOf('hour') > this.getDate(max).startOf('hour');
                }
                date = dayjs(time);
                return {
                    dayString: n + 1,
                    day: n + 1,
                    date: this.getFormatted(date.date(n + 1)),
                    disabled,
                };
            }),
        ];
    };

    useMonthAnimation = (activeDate: any, distance: number, onEnd = () => null) => {
        /* eslint-disable react-hooks/rules-of-hooks */
        const [lastDate, setLastDate] = useState(activeDate);
        const [changeWay, setChangeWay] = useState(null);
        const monthYearAnimation = useRef(new Animated.Value(0)).current;

        const changeMonthAnimation = (type: any) => {
            setChangeWay(type);
            setLastDate(activeDate);
            monthYearAnimation.setValue(1);
            Animated.timing(monthYearAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.bezier(0.33, 0.66, 0.54, 1),
            }).start(onEnd);
        };

        const shownAnimation = {
            opacity: monthYearAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
            }),
            transform: [
                {
                    translateX: monthYearAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, changeWay === 'NEXT' ? -distance : distance],
                    }),
                },
            ],
        };

        const hiddenAnimation = {
            opacity: monthYearAnimation,
            transform: [
                {
                    translateX: monthYearAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [changeWay === 'NEXT' ? distance : -distance, 0],
                    }),
                },
            ],
        };

        return [{ lastDate, shownAnimation, hiddenAnimation }, changeMonthAnimation];
    };

    // legacy
    returnValidTime = (current: Date) => {
        const { min, max } = this.data;
        const currentTime = new Date(current).getTime();
        let newTime = current;
        if (min) {
            const minTime = new Date(current).setHours(min.getHours(), min.getMinutes(), 0);
            if (currentTime < minTime) {
                newTime = min;
            }
        } else if (max) {
            const maxTime = new Date(current).setHours(max.getHours(), max.getMinutes(), 0);
            if (currentTime > maxTime) {
                newTime = max;
            }
        }
        return newTime;
    };

    validateTime = (val: string, isAmPmTime?: boolean, isAM?: boolean) => {
        const regexp = /^\d{0,2}?\:?\d{0,2}$/;

        const [hoursStr, minutesStr] = val.split(':');

        if (!regexp.test(val)) {
            return false;
        }

        const maxHour = isAmPmTime ? 12 : 24;

        const hours = Number(hoursStr);
        const minutes = Number(minutesStr);

        const isValidHour = (hour: string | number) =>
            Number.isInteger(hour) &&
            hour >= 0 &&
            hour < (isAmPmTime && isAM ? maxHour + 1 : maxHour);
        const isValidMinutes = (min1: string | number) =>
            (Number.isInteger(min1) &&
                hours >= 0 &&
                hours < (isAmPmTime ? maxHour + 1 : maxHour)) ||
            Number.isNaN(min1);

        if (!isValidHour(hours) || !isValidMinutes(minutes)) {
            return false;
        }

        if (minutes < 10 && Number(minutesStr[0]) > 5) {
            return false;
        }

        const valArr = val.indexOf(':') !== -1 ? val.split(':') : [val];

        // check mm and HH
        if (
            valArr[0] &&
            valArr[0].length &&
            (parseInt(valArr[0], 10) < 0 ||
                parseInt(valArr[0], 10) > (isAmPmTime ? maxHour + 1 : maxHour - 1))
        ) {
            return false;
        }

        if (
            valArr[1] &&
            valArr[1].length &&
            (parseInt(valArr[1], 10) < 0 ||
                (isAmPmTime && !isAM && hours === maxHour + 1
                    ? parseInt(valArr[1], 10) > 0
                    : parseInt(valArr[1], 10) > 59))
        ) {
            return false;
        }
        return true;
    };

    convertToAmPm = (value: Date | Dayjs | string) => {
        return dayjs(value).hour() === 12
            ? `00:${dayjs(value).minute()}`
            : dayjs(value).format('hh:mm');
    };

    convertHourTo24 = (value: number, isAM: boolean) => {
        if (isAM) {
            return value === 12 ? 0 : value;
        }
        return value !== 12 ? value + 12 : value;
    };
}

export { Utils };
