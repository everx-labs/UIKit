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

import { Header } from './Header';
import { useCalendar } from '../calendarContext';
import { PickerActionName } from '../../../types';

export function Calendar() {
    const {
        state: { activeDate, selectedDate },
        dispatch,
        utils,
        onChange,
    } = useCalendar();
    // const { shownAnimation, changeMonthAnimation } = utils.useMonthAnimation(
    //     state.activeDate,
    //     200, // TODO!
    // );
    const theme = useTheme();

    const days = React.useMemo(() => utils.getMonthDays(activeDate), [utils, activeDate]).reduce(
        (acc, item, index) => {
            const row = Math.trunc(index / utils.config.dayNamesShort.length);

            if (acc[row] == null) {
                acc[row] = new Array(utils.config.dayNamesShort.length).fill(undefined);
            }
            acc[row][index - row * utils.config.dayNamesShort.length] = item;

            return acc;
        },
        [] as ReturnType<typeof utils.getMonthDays>[],
    );

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
            <View
                style={[
                    styles.daysName,
                    {
                        borderBottomColor: theme[ColorVariants.BackgroundOverlay],
                    },
                ]}
            >
                {utils.config.dayNamesShort.map((item: any) => (
                    <UILabel color={ColorVariants.TextSecondary} key={item}>
                        {item}
                    </UILabel>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {days.map(row => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        {row.map(day => {
                            const isSelected = day != null && selectedDate.isSame(day.date, 'day');
                            console.log(day, isSelected, selectedDate);
                            return (
                                <TouchableOpacity
                                    style={[
                                        {
                                            height: 34,
                                            aspectRatio: 1,
                                            borderRadius: 34 / 2,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        },
                                        isSelected && {
                                            backgroundColor:
                                                theme[ColorVariants.StaticBackgroundAccent],
                                        },
                                    ]}
                                    onPress={() => !day.disabled && onSelectDay(day.date)}
                                    activeOpacity={0.8}
                                >
                                    {day && (
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
                                            {day.dayString}
                                        </UILabel>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
                {/* <View style={[style.container, { flexDirection: 'row' }]}>
                    {days.map((day: any, n: React.Key | null | undefined) => (
                        <View
                            key={n}
                            style={{
                                width: itemSize,
                                height: itemSize,
                            }}
                        >
                            {day && (
                                <TouchableOpacity
                                    style={[
                                        style.dayItem,
                                        {
                                            borderRadius: itemSize / 2,
                                        },
                                        mainState.selectedDate === day.date &&
                                            style.dayItemSelected,
                                    ]}
                                    onPress={() => !day.disabled && onSelectDay(day.date)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            style.dayText,
                                            mainState.selectedDate === day.date &&
                                                style.dayTextSelected,
                                            day.disabled && style.dayTextDisabled,
                                        ]}
                                    >
                                        {day.dayString}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    daysName: {
        flexDirection: 'row',
        paddingBottom: 10,
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'space-around',

        borderBottomWidth: 1,
        marginHorizontal: 15,
    },
    daysContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 5,
    },
});
