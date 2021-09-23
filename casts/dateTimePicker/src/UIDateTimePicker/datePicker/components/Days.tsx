import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';

import { useCalendar } from '../calendarContext';
import type { PickerOptionsType } from '../../../types';

export const Days = () => {
    const { options, state, utils, onChange } = useCalendar();
    const [mainState, setMainState] = state;
    const [itemSize, setItemSize] = useState(0);
    const style = styles(options);
    const days = useMemo(
        () => utils.getMonthDays(mainState.activeDate),
        [utils, mainState.activeDate],
    );

    const onSelectDay = (date: Date) => {
        /**
         * In case the user did not select the time in datetime mode, but immediately clicked on the date, we must set the most probable time within the minimum and maximum time by taking the time from the mainState.activeDate.
         */
        // TODO: fix the fact that `activeDate` might be a string
        const validTime = utils.returnValidTime(new Date(mainState.activeDate));
        const newDate = new Date(
            new Date(date).setHours(validTime.getHours(), validTime.getMinutes()),
        );
        setMainState({
            type: 'set',
            selectedDate: newDate,
        });
        onChange && onChange(newDate);
    };

    const changeItemHeight = ({ nativeEvent }: LayoutChangeEvent) => {
        const { width } = nativeEvent.layout;
        // @ts-expect-error
        !itemSize && setItemSize((width / 7).toFixed(2) * 1 - 0.5);
    };

    return (
        <View style={[style.container, utils.flexDirection]} onLayout={changeItemHeight}>
            {days.map((day: any, n: React.Key | null | undefined) => (
                <View
                    /* eslint-disable-next-line react/no-array-index-key */
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
                                mainState.selectedDate === day.date && style.dayItemSelected,
                            ]}
                            onPress={() => !day.disabled && onSelectDay(day.date)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    style.dayText,
                                    mainState.selectedDate === day.date && style.dayTextSelected,
                                    day.disabled && style.dayTextDisabled,
                                ]}
                            >
                                {day.dayString}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = (theme: PickerOptionsType) =>
    StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            flexWrap: 'wrap',
        },
        dayItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 3,
        },
        dayItemSelected: {
            backgroundColor: theme.mainColor,
        },
        dayText: {
            fontSize: theme.textFontSize,
            color: theme.textDefaultColor,
            textAlign: 'center',
            width: '100%',
        },
        dayTextSelected: {
            color: theme.selectedTextColor,
        },
        dayTextDisabled: {
            opacity: 0.2,
        },
    });
