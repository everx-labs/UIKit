import React, { useReducer, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

import { Calendar, SelectMonth, SelectTime } from './components';
import { CalendarContext, useCalendar } from './calendarContext';
import { Utils } from '../utils';
import {
    PickerAction,
    PickerActionName,
    PickerOptionsType,
    PickerPropsType, PickerStateType,
    UIDateTimePickerMode,
    UIDateTimePickerType,
} from '../../types';

const reducer = (state: PickerStateType, action: PickerAction) => {
    switch (action.type) {
        case PickerActionName.Set:
            return { ...state, ...action };
        case PickerActionName.ToggleTime:
            return { ...state, timeOpen: !state.timeOpen };
        case PickerActionName.ToggleMonth:
            return { ...state, monthOpen: !state.monthOpen };
        default:
            throw new Error('Unexpected action');
    }
};

const DatePicker = (props: UIDateTimePickerType) => {
    const theme = useTheme();

    const options: PickerOptionsType = {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        textHeaderColor: theme[ColorVariants.TextPrimary],
        textDefaultColor: theme[ColorVariants.TextPrimary],
        selectedTextColor: theme[ColorVariants.StaticTextPrimaryLight],
        mainColor: theme[ColorVariants.BackgroundAccent],
        textSecondaryColor: theme[ColorVariants.TextSecondary],
        borderColor: theme[ColorVariants.BackgroundOverlay],
        textFontSize: 15,
        textHeaderFontSize: 17,
        headerAnimationDistance: 100,
        daysAnimationDistance: 200,
    };

    const calendarUtils = new Utils(
        props as UIDateTimePickerType & PickerPropsType,
    );

    const contextValue = {
        ...props,
        onChange: props.onValueRetrieved,
        reverse: false,
        options: { ...options },
        utils: calendarUtils,
        state: useReducer(reducer, {
            activeDate: props.current, // Date in calendar also save time
            selectedDate: props.selected
                ? calendarUtils.getFormatted(
                      calendarUtils.getDate(props.selected),
                  )
                : '',
            monthOpen: props.mode === UIDateTimePickerMode.MonthYear,
            timeOpen: props.mode === UIDateTimePickerMode.Time,
        }),
    };
    const [minHeight, setMinHeight] = useState(300);
    const style = styles(contextValue.options);

    const renderBody = () => {
        switch (contextValue.mode) {
            default:
            case 'calendar':
                return (
                    <React.Fragment>
                        <Calendar />
                        <SelectMonth />
                    </React.Fragment>
                );
            case 'time':
                return <SelectTime />;
        }
    };

    return (
        <CalendarContext.Provider value={contextValue}>
            <View
                style={[style.container, { minHeight }]}
                onLayout={({ nativeEvent }) =>
                    setMinHeight(nativeEvent.layout.width * 0.9 + 55)
                }
            >
                {renderBody()}
            </View>
        </CalendarContext.Provider>
    );
};

DatePicker.defaultProps = {
    onChange: () => null,
    onMonthYearChange: () => null,
    current: new Date(),
    selectorStartingYear: 0,
    selectorEndingYear: 3000,
    disableDateChange: false,
    isGregorian: true,
    reverse: 'unset',
    mode: 'datepicker',
    interval: 5,
};

const styles = (theme: { backgroundColor: any }) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
        },
    });

export { DatePicker, CalendarContext, useCalendar };
