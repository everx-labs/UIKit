import React from 'react';
import {
    Platform,
    TextInput,
    Text,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import Animated, {
    interpolateColor,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import {
    ColorVariants,
    Typography,
    TypographyVariants,
    UILabel,
    UITextView,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { ScrollView } from '@tonlabs/uikit.navigation';

import { useCalendar } from '../../calendarContext';
import { TimeInputWarning } from './TimeInputWarning';
import { TimeInputSwitcher } from './TimeInputSwitcher';
import { UIConstant } from '../../../../constants';

import { AnimatedTextInput } from '../../../../UIAnimatedBalance/AnimatedTextInput';
import { PickerActionName } from '../../../../types';

Animated.addWhitelistedNativeProps({ text: true });

type TimeInputProps = {
    initialTextTime: string;
    onChange: (hourse: number, minutes: number) => void;
};

// @inline
const TIME_INPUT_IS_NOT_IN_FOCUS = 0;
// @inline
const TIME_INPUT_IS_IN_FOCUS = 1;

const TimeInput = React.forwardRef<TextInput, TimeInputProps>(function TimeInput(
    { initialTextTime, onChange }: TimeInputProps,
    forwardedRef,
) {
    const inputRef = React.useRef<TextInput>(null);

    // @ts-ignore TS doesn't understand it, but it works
    React.useImperativeHandle(forwardedRef, () => inputRef.current);

    const theme = useTheme();
    const isFocused = useSharedValue(TIME_INPUT_IS_NOT_IN_FOCUS);

    const bgStyle = useAnimatedStyle(() => {
        return {
            borderWidth: 2,
            borderColor: interpolateColor(
                isFocused.value,
                [TIME_INPUT_IS_NOT_IN_FOCUS, TIME_INPUT_IS_IN_FOCUS],
                [
                    theme[ColorVariants.BackgroundTertiary] as string,
                    theme[ColorVariants.LineAccent] as string,
                ],
            ),
            backgroundColor: theme[ColorVariants.BackgroundTertiary],
        };
    });

    const hours = useSharedValue(initialTextTime.split(':')[0]);
    const minutes = useSharedValue(initialTextTime.split(':')[1]);

    const hoursProps: any = useAnimatedProps(() => {
        return {
            text: hours.value,
        };
    });
    const minutesProps: any = useAnimatedProps(() => {
        return {
            text: minutes.value,
        };
    });

    const onChangeTextTime = React.useCallback((text: string) => {
        const newValue = text.length > 4 ? text.slice(text.length - 4) : text;

        const newHours = `${newValue[0] || ''}${newValue[1] || ''}`;
        const newMinutes = `${newValue[2] || ''}${newValue[3] || ''}`;

        hours.value = newHours;
        minutes.value = newMinutes;
        inputRef.current?.setNativeProps({
            text: newValue,
        });

        onChange(Number(newHours), Number(newMinutes));
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
            <Animated.View style={[styles.timeInput, bgStyle]}>
                <UITextView
                    ref={inputRef}
                    style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
                    multiline={false}
                    keyboardType="numeric"
                    defaultValue={hours.value + minutes.value}
                    onChangeText={onChangeTextTime}
                    onFocus={() => {
                        isFocused.value = withSpring(TIME_INPUT_IS_IN_FOCUS, {
                            overshootClamping: true,
                        });
                    }}
                    onBlur={() => {
                        isFocused.value = withSpring(TIME_INPUT_IS_NOT_IN_FOCUS, {
                            overshootClamping: true,
                        });
                    }}
                />
                <View style={{ flex: 1, alignItems: 'flex-end' }} pointerEvents="none">
                    <AnimatedTextInput
                        style={[
                            Typography[TypographyVariants.Action],
                            { lineHeight: undefined, padding: 0, fontVariant: ['tabular-nums'] },
                            // { backgroundColor: 'rgba(255,0,0,.1)' },
                        ]}
                        animatedProps={hoursProps}
                        defaultValue={hours.value}
                        underlineColorAndroid="transparent"
                        editable={false}
                    />
                </View>
                <Text
                    style={[
                        Typography[TypographyVariants.Action],
                        { color: theme[ColorVariants.TextSecondary], lineHeight: undefined },
                        // { backgroundColor: 'rgba(0,255,0,.1)' },
                    ]}
                >
                    :
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-start' }} pointerEvents="none">
                    <AnimatedTextInput
                        style={[
                            Typography[TypographyVariants.Action],
                            { lineHeight: undefined, padding: 0, fontVariant: ['tabular-nums'] },
                            // { backgroundColor: 'rgba(0,0,255,.1)' },
                        ]}
                        animatedProps={minutesProps}
                        defaultValue={minutes.value}
                        underlineColorAndroid="transparent"
                        editable={false}
                    />
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});

export function UITimeInput() {
    const { state: mainState, dispatch, min, max, isAmPmTime, utils } = useCalendar();

    const initialTime = React.useMemo(() => {
        return min || max ? dayjs(min ?? max) : dayjs(mainState.activeDate ?? null);
    }, [mainState.activeDate, max, min]);

    const initialTextTime = isAmPmTime
        ? utils.convertToAmPm(initialTime)
        : initialTime.format('HH:mm');

    const [time, setTime] = React.useState<Dayjs>(initialTime);
    const [timeValidated, setTimeValidated] = React.useState(true);

    const [isAM, setAM] = React.useState(dayjs(initialTime).format('a') === 'am');

    const returnUnixTime = React.useCallback(
        (value: Date | Dayjs | undefined) => {
            if (value) {
                const hour = dayjs(value).hour();
                const minute = dayjs(value).minute();
                return dayjs(time).hour(hour).minute(minute).second(0).valueOf();
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

    const onChangeAmPm = React.useCallback(() => {
        setAM(!isAM);
    }, [isAM]);

    React.useEffect(() => {
        // TODO!
        dispatch({
            type: PickerActionName.Set,
            time,
            isValidDateTime: timeValidated,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    // React.useEffect(() => {
    //     const isValidTime = utils.validateTime(timeInputHolderRef.current, isAmPmTime, isAM);
    //     setTimeValidated(isValidTime);
    //     if (isValidTime) {
    //         parseTime(timeInputHolderRef.current);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isAM]);

    const inputRef = React.useRef<TextInput>(null);

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
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
            <View style={styles.selectTimeInputContainer}>
                {/* TODO: localize me! */}
                <UILabel role={TypographyVariants.TitleMedium}>Time</UILabel>
                <View style={styles.timeInputWrapper}>
                    <TimeInput
                        ref={inputRef}
                        initialTextTime={initialTextTime}
                        onChange={(hours, minutes) => {
                            if (isNaN(hours) || isNaN(minutes)) {
                                setTimeValidated(false);
                                return;
                            }

                            const hoursNormilized = isAmPmTime
                                ? utils.convertHourTo24(hours, isAM)
                                : hours;

                            const time = dayjs()
                                .hour(hoursNormilized)
                                .minute(minutes)
                                .second(0)
                                .millisecond(0);
                            setTime(time);
                            setTimeValidated(checkMinMaxScope(time));
                        }}
                    />
                    {isAmPmTime && <TimeInputSwitcher isAM={isAM} onPress={onChangeAmPm} />}
                </View>
            </View>
            {(min || max) && <TimeInputWarning isValidTime={timeValidated} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: UIConstant.contentOffset,
        paddingTop: UIConstant.contentOffset,
    },
    selectTimeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeInputWrapper: { flexDirection: 'row' },
    timeInput: {
        width: 65, // TODO: why it's hardcoded!!!
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
});
