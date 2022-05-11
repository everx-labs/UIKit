import React from 'react';
import { Platform, Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
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
    useTheme,
    AnimateableText,
} from '@tonlabs/uikit.themes';
import { UITextView, UITextViewRef } from '@tonlabs/uikit.inputs';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';

import { useTime } from './useTime';
import { TimeInputWarning } from './TimeInputWarning';
import { TimeInputSwitcher } from './TimeInputSwitcher';

Animated.addWhitelistedNativeProps({ text: true });

type TimeInputProps = {
    initialTextTime: string;
    onChange: (hourse: number, minutes: number) => void;
};

// @inline
const TIME_INPUT_IS_NOT_IN_FOCUS = 0;
// @inline
const TIME_INPUT_IS_IN_FOCUS = 1;

const TimeInput = React.forwardRef<UITextViewRef, TimeInputProps>(function TimeInput(
    { initialTextTime, onChange }: TimeInputProps,
    forwardedRef,
) {
    const inputRef = React.useRef<UITextViewRef>(null);

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

    const onChangeTextTime = React.useCallback(
        (text: string) => {
            const newValue = text.length > 4 ? text.slice(text.length - 4) : text;

            const newHours = `${newValue[0] || ''}${newValue[1] || ''}`;
            const newMinutes = `${newValue[2] || ''}${newValue[3] || ''}`;

            hours.value = newHours;
            minutes.value = newMinutes;
            inputRef.current?.setNativeProps({
                text: newValue,
            });

            onChange(Number(newHours), Number(newMinutes));
        },
        [hours, minutes, onChange],
    );

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
                    <AnimateableText
                        style={[
                            Typography[TypographyVariants.Action],
                            { lineHeight: undefined, padding: 0, fontVariant: ['tabular-nums'] },
                        ]}
                        animatedProps={hoursProps}
                        selectable={false}
                    />
                </View>
                <Text
                    style={[
                        Typography[TypographyVariants.Action],
                        { color: theme[ColorVariants.TextSecondary], lineHeight: undefined },
                    ]}
                >
                    :
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-start' }} pointerEvents="none">
                    <AnimateableText
                        style={[
                            Typography[TypographyVariants.Action],
                            { lineHeight: undefined, padding: 0, fontVariant: ['tabular-nums'] },
                        ]}
                        animatedProps={minutesProps}
                        selectable={false}
                    />
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});

export function Time() {
    const { initialTime, isValid, haveValidation, isAmPmTime, isAM, toggleAmPm, set } = useTime();

    const inputRef = React.useRef<UITextViewRef>(null);

    React.useEffect(() => {
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
        <View style={styles.wrapper}>
            <View style={styles.selectTimeInputContainer}>
                <UILabel role={TypographyVariants.TitleMedium}>
                    {uiLocalized.DateTimePicker.Time}
                </UILabel>
                <View style={styles.timeInputWrapper}>
                    <TimeInput ref={inputRef} initialTextTime={initialTime} onChange={set} />
                    {isAmPmTime && <TimeInputSwitcher isAM={isAM} onPress={toggleAmPm} />}
                </View>
            </View>
            {haveValidation && <TimeInputWarning isValidTime={isValid} />}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: UILayoutConstant.contentOffset,
        paddingTop: UILayoutConstant.contentOffset,
    },
    selectTimeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeInputWrapper: { flexDirection: 'row' },
    timeInput: {
        width: 65,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
});
