import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import dayjs from 'dayjs';
import type { PickerPropsType, UIDateTimePickerType } from '../types';

const gregorianConfigs = {
    dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    selectedFormat: 'YYYY/MM/DD',
    dateFormat: 'YYYY/MM/DD',
    monthYearFormat: 'YYYY MM',
    timeFormat: 'HH:mm',
    hour: 'Hour',
    minute: 'Minute',
    timeSelect: 'Select',
    timeClose: 'Close',
};

class Utils {
    private readonly data: {
        isGregorian: boolean | undefined;
        max: Date | undefined;
        reverse: boolean | undefined;
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
    constructor({
        min,
        max,
        isGregorian,
        mode,
        reverse,
        configs,
    }: UIDateTimePickerType & PickerPropsType) {
        this.data = {
            min,
            max,
            isGregorian,
            reverse: reverse === 'unset' ? !isGregorian : reverse,
        };
        this.config = gregorianConfigs;
        // @ts-expect-error
        this.config = { ...this.config, ...configs };
        if (mode === 'time' || mode === 'datepicker') {
            this.config.selectedFormat = `${this.config.dateFormat} ${this.config.timeFormat}`;
        }
    }

    get flexDirection() {
        return {
            flexDirection: 'row'
        };
    }

    getFormatted = (date: any, formatName: string = 'selectedFormat') =>
        // @ts-expect-error
        date.format(this.config[formatName]);

    getFormattedDate = (date = new Date(), format = 'YYYY/MM/DD') =>
        dayjs(date).format(format);

    getTime = (time: Date) => this.getDate(time).format(this.config.timeFormat);

    getToday = () => this.getFormatted(new Date(), 'dateFormat');

    getMonthName = (month: number) => this.config.monthNames[month];

    toPersianNumber = (value: number) => {
        const { isGregorian } = this.data;
        return isGregorian
            ? this.toEnglish(String(value))
            : String(value).replace(/[0-9]/g, (w) =>
                  String.fromCharCode(w.charCodeAt(0) + '۰'.charCodeAt(0) - 48),
              );
    };

    toEnglish = (value: string) => {
        const charCodeZero = '۰'.charCodeAt(0);
        // @ts-expect-error
        return value.replace(/[۰-۹]/g, (w) => w.charCodeAt(0) - charCodeZero);
    };

    getDate = (time: dayjs.ConfigType | undefined) => dayjs(time);

    getMonthYearText = (time: dayjs.ConfigType | undefined) => {
        const date = dayjs(time);
        const year = this.toPersianNumber(date.year());
        const month = this.getMonthName(date.month());
        return `${month} ${year}`;
    };

    checkMonthDisabled = (time: dayjs.ConfigType | undefined) => {
        const { min, max } = this.data;
        const date = dayjs(time);
        let disabled = false;
        if (min) {
            const lastDayInMonth = date.date(date.daysInMonth());
            disabled =
                lastDayInMonth.startOf('hour') < dayjs(min).startOf('hour');
        }
        if (max && !disabled) {
            const firstDayInMonth = date.date(1);
            disabled =
                firstDayInMonth.startOf('hour') >
                dayjs(max).startOf('hour');
        }
        return disabled;
    };

    checkArrowMonthDisabled = (
        time: dayjs.ConfigType | undefined,
        next: any,
    ) => {
        const date = dayjs(time);
        return this.checkMonthDisabled(date.add(next ? -1 : 1, 'month'));
    };

    checkYearDisabled = (year: number, next: any) => {
        const { min, max } = this.data;
        const y = dayjs(next ? max : min).year();
        return next ? year >= y : year <= y;
    };

    checkSelectMonthDisabled = (
        time: dayjs.ConfigType | undefined,
        month: number,
    ) => {
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
                    disabled =
                        thisDay.startOf('hour') <
                        this.getDate(min).startOf('hour');
                }
                if (max && !disabled) {
                    disabled =
                        thisDay.startOf('hour') >
                        this.getDate(max).startOf('hour');
                }
                date = dayjs(time);
                return {
                    dayString: this.toPersianNumber(n + 1),
                    day: n + 1,
                    date: this.getFormatted(date.date(n + 1)),
                    disabled,
                };
            }),
        ];
    };

    useMonthAnimation = (
        activeDate: any,
        distance: number,
        onEnd = () => null,
    ) => {
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
                        outputRange: [
                            0,
                            changeWay === 'NEXT' ? -distance : distance,
                        ],
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
                        outputRange: [
                            changeWay === 'NEXT' ? distance : -distance,
                            0,
                        ],
                    }),
                },
            ],
        };

        return [
            { lastDate, shownAnimation, hiddenAnimation },
            changeMonthAnimation,
        ];
    };

    validateTimeMinMax = (
        newTime: string | number | Date,
        min: { getHours: () => any; getMinutes: () => any },
        max: { getHours: () => any; getMinutes: () => any },
    ) => {
        const newHour = new Date(newTime).getHours();
        const newMinute = new Date(newTime).getMinutes();

        // comparing newTime with maxTime and minTime by hours and minutes, not considering the date
        if (min) {
            const minHour = min.getHours();
            const minMinute = min.getMinutes();

            if (
                (newHour === minHour && newMinute < minMinute) ||
                newHour < minHour
            ) {
                return false;
            }
        }
        if (max) {
            const maxHour = max.getHours();
            const maxMinute = max.getMinutes();

            if (
                (newHour === maxHour && newMinute > maxMinute) ||
                newHour > maxHour
            ) {
                return false;
            }
        }

        return true;
    };

    // Format time: Date to time: string like 00:00
    formatTime = (value: string | number | Date) => {
        if (value) {
            const hoursValue = new Date(value).getHours();
            const minutesValue = new Date(value).getMinutes();
            const formattedHours =
                hoursValue < 10 ? `0${hoursValue}` : hoursValue;
            const formattedMinutes =
                minutesValue < 10 ? `0${minutesValue}` : minutesValue;

            return `${formattedHours}:${formattedMinutes}`;
        }
        return '00:00';
    };
}

export { Utils };
