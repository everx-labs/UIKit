import React, { useReducer, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

// @ts-ignore
import { Calendar, SelectMonth, SelectTime } from './components';
// @ts-ignore
import { CalendarContext, useCalendar } from './calendarContext';
// @ts-ignore
import { utils } from '../utils';
import { PickerOptionsType, PickerPropsType, UIDateTimePickerMode } from '../../types';


// eslint-disable-next-line no-shadow
enum ActionKind {
    Set = 'set',
    ToggleTime = 'toggleTime',
}

type Action = {
    value: any,
    type: ActionKind,
    state: PickerStateType
}
interface PickerStateType {
    activeDate?: Date, // Date in calendar also save time
    selectedDate?: Date,
    timeOpen?: boolean,
}

const reducer = (state: PickerStateType, action: Action) => {
    switch (action.type) {
        case ActionKind.Set:
            return { ...state, ...action };
        case ActionKind.ToggleTime:
            return { ...state, timeOpen: !state.timeOpen };
        default:
            throw new Error('Unexpected action');
    }
};

// const minuteIntervalArray = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

const DatePicker = (props: PickerPropsType) => {
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

    // eslint-disable-next-line new-cap
    const calendarUtils = new utils(props);

    const contextValue = {
        ...props,
        reverse: false,
        options: {...options},
        utils: calendarUtils,
        state: useReducer(reducer, {
            activeDate: props.currentDate, // Date in calendar also save time
            selectedDate: props.selected
                ? calendarUtils.getFormated(
                      calendarUtils.getDate(props.selected),
                  )
                : '',
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
    onTimeChange: () => null,
    onDateChange: () => null,
    currentDate: new Date(),
    currentTime: new Date(),
    selected: undefined,
    minimumDate: undefined,
    maximumDate: undefined,
    minimumTime: undefined,
    maximumTime: undefined,
    selectorStartingYear: 0,
    selectorEndingYear: 3000,
    disableDateChange: false,
    isGregorian: true,
    reverse: 'unset',
    mode: 'datepicker',
    minuteInterval: 5,
};


const styles = (theme: { backgroundColor: any; }) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
        },
    });

export { DatePicker, CalendarContext, useCalendar };
