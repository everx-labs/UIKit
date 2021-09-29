import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    TouchableOpacity,
} from '@tonlabs/uikit.hydrogen';

import { useCalendar } from '../calendarContext';
import { PickerActionName } from '../../../types';
import { UIConstant } from '../../../constants';

export function Calendar() {
    const {
        state: { activeDate, selectedDate },
        dispatch,
        utils,
    } = useCalendar();
    // const { shownAnimation, changeMonthAnimation } = utils.useMonthAnimation(
    //     state.activeDate,
    //     200, // TODO!
    // );
    const theme = useTheme();

    // TODO: it has different order for different countries!
    const { dayNamesShort } = utils.config;

    type MonthDaysT = ReturnType<typeof utils.getMonthDays>;
    type MonthDayT = MonthDaysT extends readonly (infer T)[] ? T : never;

    const days = React.useMemo(() => utils.getMonthDays(activeDate), [utils, activeDate]).reduce<
        (MonthDayT | string)[][]
    >((acc, item, index) => {
        const row = Math.trunc(index / utils.config.dayNamesShort.length);
        const column = index - row * utils.config.dayNamesShort.length;

        if (acc[column] == null) {
            acc[column] = [dayNamesShort[column]];
        }

        acc[column].push(item);

        return acc;
    }, []);

    const onSelectDay = (date: Date) => {
        /**
         * In case the user did not select the time in datetime mode, but immediately clicked on the date, we must set the most probable time within the minimum and maximum time by taking the time from the mainState.activeDate.
         */
        // TODO: fix the fact that `activeDate` might be a string
        const validTime = utils.returnValidTime(new Date(activeDate));
        const newDate = dayjs(
            new Date(date).setHours(validTime.getHours(), validTime.getMinutes()),
        );
        dispatch({
            type: PickerActionName.Set,
            payload: {
                selectedDate: newDate,
            },
        });
        // onChange && onChange(newDate);
    };

    // React.useEffect(() => {
    //     selectedDate && onChange && onChange(selectedDate);
    // }, [selectedDate, onChange]);

    return (
        <View style={styles.container}>
            {/* <Header changeMonth={changeMonthAnimation} /> */}
            {days.map((column, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {column.map((day, index) => {
                        if (typeof day === 'string') {
                            return (
                                <UILabel
                                    role={UILabelRoles.ActionFootnote}
                                    color={ColorVariants.TextSecondary}
                                    key={day}
                                >
                                    {day}
                                </UILabel>
                            );
                        }

                        const isSelected = day != null && selectedDate.isSame(day.date, 'day');
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.day,
                                    isSelected && {
                                        backgroundColor:
                                            theme[ColorVariants.StaticBackgroundAccent],
                                    },
                                ]}
                                onPress={
                                    day != null
                                        ? () => !day.disabled && onSelectDay(day.date)
                                        : undefined
                                }
                                activeOpacity={0.8}
                            >
                                {
                                    <UILabel
                                        role={
                                            isSelected
                                                ? UILabelRoles.HeadlineHead
                                                : UILabelRoles.Action
                                        }
                                        color={
                                            isSelected
                                                ? UILabelColors.TextAccent
                                                : UILabelColors.TextPrimary
                                        }
                                    >
                                        {day ? day.dayString : ' '}
                                    </UILabel>
                                }
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: UIConstant.contentOffset,
        justifyContent: 'space-between',
    },
    day: {
        // height: UIConstant.calendar.dayCeilHeight,
        paddingVertical: 5,
        aspectRatio: 1,
        borderRadius: UIConstant.calendar.dayCeilPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
    },
});
