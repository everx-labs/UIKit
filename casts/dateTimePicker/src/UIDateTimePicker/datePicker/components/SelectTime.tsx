import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.controls';
import { UILabel } from '@tonlabs/uikit.themes';
import { useCalendar } from '../calendarContext';
import { UITimeInput } from './TimeInput';
import { UIDateTimePickerMode } from '../../../types';

const SelectTime = () => {
    const { options, state, utils, min, max, mode, onChange } = useCalendar();
    const [mainState, setMainState] = state;
    const [show, setShow] = useState(false);
    const [isValidTime, setValidTime] = useState(true);
    const [time, setTime] = useState(
        mainState.activeDate ? new Date(mainState.activeDate) : new Date(),
    );
    const style = styles(options);
    const openAnimation = useRef(new Animated.Value(0)).current;
    const minHour = min ? new Date(min).getHours() : 0;
    const maxHour = max ? new Date(max).getHours() : 23;
    const minMinute = min ? new Date(min).getMinutes() : 0;
    const maxMinute = max ? new Date(max).getMinutes() : 0;

    useEffect(() => {
        mainState.timeOpen && setShow(true);
        Animated.timing(openAnimation, {
            toValue: mainState.timeOpen ? 1 : 0,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.bezier(0.17, 0.67, 0.46, 1),
        }).start(() => {
            !mainState.timeOpen && setShow(false);
        });
    }, [mainState.timeOpen, openAnimation]);

    const selectTime = () => {
        const newTime = new Date(new Date().setHours(time.getHours(), time.getMinutes(), 0));
        const newTimeForActiveDate = new Date(
            new Date(mainState.activeDate).setHours(time.getHours(), time.getMinutes(), 0),
        );
        setMainState({
            type: 'set',
            activeDate: newTimeForActiveDate,
            selectedDate: mainState.selectedDate
                ? new Date(
                      new Date(mainState.selectedDate).setHours(
                          time.getHours(),
                          time.getMinutes(),
                          0,
                      ),
                  )
                : '',
        });
        if (mode !== UIDateTimePickerMode.Time) {
            setMainState({
                type: 'toggleTime',
            });
        } else if (onChange) {
            onChange(newTime);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    // eslint-disable-next-line no-shadow
    const updateTime = (time: Date | number, isHour?: boolean) => {
        let newTime = new Date(time);
        if (isHour) {
            const curMinutes = new Date(time).getMinutes();
            const newHour = new Date(time).getHours();
            if (newHour === minHour) {
                // @ts-ignore
                if (curMinutes < new Date(min).getMinutes()) {
                    newTime = new Date(newTime.setHours(newHour, minMinute));
                }
            } else if (newHour === maxHour) {
                // @ts-ignore
                if (curMinutes > new Date(max).getMinutes()) {
                    newTime = new Date(newTime.setHours(newHour, maxMinute));
                }
            }
        }
        const isValidated = utils.validateTimeMinMax(new Date(newTime), min, max);
        setValidTime(isValidated);
        setTime(newTime);
    };

    const containerStyle = [
        style.container,
        {
            opacity: openAnimation,
            transform: [
                {
                    scale: openAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1.1, 1],
                    }),
                },
            ],
        },
    ];

    return show ? (
        <Animated.View style={containerStyle}>
            <View style={style.header}>
                <UILabel>{`Please choose time from ${utils.formatTime(min)} to ${utils.formatTime(
                    max,
                )}`}</UILabel>
            </View>
            <UITimeInput
                current={time}
                onChange={(newTime: Date, isHour?: boolean) => updateTime(newTime, isHour)}
            />
            <View style={style.footer}>
                {mode !== UIDateTimePickerMode.Time && (
                    <View style={style.button}>
                        <UIBoxButton
                            type={UIBoxButtonType.Secondary}
                            onPress={() =>
                                setMainState({
                                    type: 'toggleTime',
                                })
                            }
                            title={utils.config.timeClose}
                        />
                    </View>
                )}
                <View style={style.button}>
                    <UIBoxButton
                        disabled={Platform.OS === 'web' ? !isValidTime : false}
                        onPress={selectTime}
                        title={utils.config.timeSelect}
                    />
                </View>
            </View>
        </Animated.View>
    ) : null;
};

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            right: 0,
            backgroundColor: theme.backgroundColor,
            borderRadius: 10,
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 999,
        },
        row: {
            flexDirection: 'column',
            alignItems: 'center',
            marginVertical: 5,
        },
        listItem: {
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
        },
        header: {
            marginBottom: 30,
            alignItems: 'center',
        },
        footer: {
            flexDirection: 'row',
        },
        button: {
            flex: 1,
            margin: 15,
        },
    });

export { SelectTime };
