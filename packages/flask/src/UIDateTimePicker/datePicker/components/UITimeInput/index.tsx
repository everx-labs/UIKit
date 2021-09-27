import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import dayjs, { Dayjs } from 'dayjs';

import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UILabel,
    UITextView,
    useTheme,
} from '@tonlabs/uikit.hydrogen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useCalendar } from '../../calendarContext';
import { TimeInputWarning } from './TimeInputWarning';
import { TimeInputHeader } from './TimeInputHeader';
import { validateTime } from './utils';
import { TimeInputSwitcher } from './TimeInputSwitcher';

export function UITimeInput() {
    const { state, min, max, isAmPmTime } = useCalendar();
    const [mainState] = state;

    const initialTime = React.useMemo(() => {
        return min || max ? dayjs(min ?? max) : dayjs(mainState.activeDate ?? null);
    }, [mainState.activeDate, max, min]);

    const initialTextTime = `${dayjs(initialTime).hour()}:${dayjs(initialTime).minute()}`;

    const [textTime, setTextTime] = React.useState(initialTextTime);
    const [time, setTime] = React.useState<Dayjs>(initialTime);
    const [timeValidated, setTimeValidated] = React.useState(true);

    const [isAM, setAM] = React.useState(true);

    const inputRef = React.useRef<TextInput>(null);

    const theme = useTheme();
    const styles = useStyles(theme);

    const returnUnixTime = React.useCallback(
        (value: Date | Dayjs | undefined) => {
            if (value) {
                const hour = dayjs(value).hour();
                const minute = dayjs(value).minute();
                return dayjs(time).hour(hour).minute(minute).valueOf();
            }
            return 0;
        },
        [time],
    );

    const maxUnix = React.useMemo(() => returnUnixTime(max), [max, returnUnixTime]);
    const minUnix = React.useMemo(() => returnUnixTime(min), [min, returnUnixTime]);

    /**
     * Check that new time value is inside min and max scope
     */
    const checkMinMaxScope = React.useCallback(
        (newTime: Dayjs) => {
            const currentUnix = dayjs(newTime).valueOf();
            if (minUnix || maxUnix) {
                if (!minUnix) {
                    return currentUnix <= maxUnix;
                }
                if (!maxUnix) {
                    return minUnix <= currentUnix;
                }
                return minUnix <= currentUnix && currentUnix <= maxUnix;
            }
            return true;
        },
        [minUnix, maxUnix],
    );

    /**
     * Parse time from string to dayjs format
     */
    const parseTime = React.useCallback(
        (value: string) => {
            let newTime;
            if (value.length) {
                const [hoursStr, minutesStr] = value.split(':');
                const hours = Number(hoursStr ?? 0);
                const minutes = Number(minutesStr ?? 0);
                newTime = dayjs().hour(hours).minute(minutes);
            } else {
                newTime = initialTime;
            }
            setTime(newTime);
            setTimeValidated(checkMinMaxScope(newTime));
        },
        [initialTime, checkMinMaxScope],
    );

    /**
     * Save time string from input
     */
    const onChangeTextTime = React.useCallback(
        (val: string) => {
            if (val === textTime) {
                return;
            }

            const isValidTime = validateTime(val, isAmPmTime);
            setTimeValidated(val.length > 5 ? timeValidated : isValidTime);

            if (isValidTime) {
                let newVal = val;
                if (newVal.length === 2 && textTime.length !== 3 && newVal.indexOf(':') === -1) {
                    newVal = `${val}:`;
                }

                if (newVal.length === 2 && textTime.length === 3) {
                    newVal = newVal.slice(0, 1);
                }

                setTextTime(newVal);
                parseTime(newVal);
            }
        },
        [textTime, timeValidated, parseTime, isAmPmTime],
    );

    const onChangeAmPm = React.useCallback(() => {
        setAM(!isAM);
    }, [isAM]);

    React.useEffect(() => {
        setTimeValidated(checkMinMaxScope(time));
        /**
         * Only web: fast autofocus on load affects the height of the parent element,
         * so we have to use a timeout to wait for the parent animation
         */
        Platform.OS === 'web'
            ? setTimeout(() => {
                  inputRef.current?.focus();
              }, 500)
            : inputRef.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return mainState.timeOpen ? (
        <View style={{ flex: 1 }}>
            <TimeInputHeader time={time} isValidTime={timeValidated} />
            <View style={styles.selectTimeBody}>
                <View style={styles.selectTimeInputContainer}>
                    <UILabel role={TypographyVariants.TitleMedium}>Time</UILabel>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.timeInput}>
                            <UITextView
                                ref={inputRef}
                                style={{ textAlign: 'center' }}
                                multiline={false}
                                keyboardType="numeric"
                                value={textTime}
                                onChangeText={(text: string) => onChangeTextTime(text)}
                            />
                        </View>
                        {isAmPmTime && <TimeInputSwitcher isAM={isAM} onPress={onChangeAmPm} />}
                    </View>
                </View>
                {(min || max) && <TimeInputWarning isValidTime={timeValidated} />}
            </View>
        </View>
    ) : null;
}

const useStyles = makeStyles((theme: Theme) => ({
    selectTimeBody: {
        marginHorizontal: 16,
        marginVertical: 20,
    },
    selectTimeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeInput: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary] as string,
        width: 65,
        borderRadius: 8,
    },
}));
