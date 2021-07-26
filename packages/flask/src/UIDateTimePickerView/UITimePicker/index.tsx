import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIBoxButton, UILabel } from '@tonlabs/uikit.hydrogen';
import type { TimePickerType } from '../../types';
import {formatTime, validateTimeMinMax} from './utils';

type TimePickerComponentType = TimePickerType & {
    onValueRetrieved: (time?: Date, timezone?: number) => void;
};

const TimeInput = ({
    minTime,
    maxTime,
    onValueRetrieved,
}: TimePickerComponentType) => {
    const [time, setTime] = React.useState('');

    const onChangeHandler = React.useCallback(
        (val: string) => {
            if (val) {
                const today = new Date();
                const newTimeArray = val.split(':');
                const hour = Number(newTimeArray[0]);
                const minute = Number(newTimeArray[1]);
                const newTime = new Date(today.setHours(hour, minute, 0));
                setTime(val);
                const isValidated = validateTimeMinMax(newTime, minTime, maxTime);
                isValidated ? onValueRetrieved(newTime) : onValueRetrieved();
            }
        },
        [onValueRetrieved, minTime, maxTime],
    );

    const inputStyle = {
        marginBottom: 40,
        textAlign: 'center',
        fontSize: 35,
        width: 160,
        alignSelf: 'center',
        border: 'none',
    };

    const inputOptions = {
        style: inputStyle,
        maxLength: 5,
        name: 'time',
        type: 'time',
        value: time,
        autoFocus: true,
        onChange: (e: any /* or some SyntheticEvent<?> */) => onChangeHandler(e.target.value),
    };

    return React.createElement('input', inputOptions);
};

export const UITimePicker = ({
    onValueRetrieved,
    minTime,
    maxTime,
    timeZoneOffset,
}: TimePickerType) => {
    const [time, setTime] = React.useState<Date>();
    const [isSelectDisabled, setSelectDisabled] = React.useState(true);

    const updateTime = React.useCallback((newTime?: Date) => {
        newTime && setTime(newTime);
        setSelectDisabled(!newTime);
    }, []);

    const onSaveButtonPress = React.useCallback(() => {
        time && timeZoneOffset && onValueRetrieved(time, timeZoneOffset);
    }, [time, timeZoneOffset, onValueRetrieved]);

    return (
        <View style={styles.container}>
            <UILabel style={styles.label}>
                {`Please choose time from ${formatTime(minTime)} to ${formatTime(maxTime)}`}
            </UILabel>
            <TimeInput
                onValueRetrieved={updateTime}
                minTime={minTime}
                maxTime={maxTime}
            />
            <UIBoxButton
                disabled={isSelectDisabled}
                title="Select"
                onPress={onSaveButtonPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 16,
        height: 160,
    },
    label: {
        textAlign: 'center',
        marginBottom: 16,
    },
});
