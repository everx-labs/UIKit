import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Animated,
    Easing,
    I18nManager,
    Platform,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { UIBoxButton, UILabel } from '@tonlabs/uikit.hydrogen';
import { useCalendar } from '../calendarContext';
import { TimeInput } from './TimeInput';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TimeScroller = ({ title, data, onChange, current }: any) => {
    const { options, utils } = useCalendar();
    const [itemSize, setItemSize] = useState(0);
    const [nativeEventWidth, setNativeEventWidth] = useState(0);
    const style = styles(options);
    const scrollAnimatedValue = useRef(new Animated.Value(0)).current;
    const scrollListener = useRef(null);
    const active = useRef(0);
    const flatListRef = useRef();

    // eslint-disable-next-line no-param-reassign
    data = ['', '', ...data, '', ''];

    useEffect(() => {
        onChange(
            current && data.length > 5
                ? data[getIndexOfCurrentItem()]
                : data[2],
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTimeout(() => {
            getOffsetOfCurrent();
        }, 200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nativeEventWidth]);

    useEffect(() => {
        // @ts-ignore
        scrollListener.current && clearInterval(scrollListener.current);
        // @ts-ignore
        scrollListener.current = scrollAnimatedValue.addListener(
            // eslint-disable-next-line no-return-assign
            ({ value }) => (active.current = value),
        );

        return () => {
            // @ts-ignore
            clearInterval(scrollListener.current);
        };
    }, [scrollAnimatedValue]);

    const getIndexOfCurrentItem = () => {
        const closest = data.reduce((prevVal: number, currVal: number) => {
            return Math.abs(currVal - current) < Math.abs(prevVal - current)
                ? currVal
                : prevVal;
        });
        const currentIndex = () => data.findIndex((i: number) => i === closest);
        return currentIndex() > 0 ? currentIndex() : 2;
    };

    const getOffsetOfCurrent = useCallback(() => {
        if (nativeEventWidth > 0) {
            const offset = Math.round(
                (getIndexOfCurrentItem() - 2) * (nativeEventWidth / 5),
            );
            // @ts-ignore
            flatListRef.current.scrollToOffset({
                animated: true,
                offset,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nativeEventWidth]);

    const changeItemWidth = ({ nativeEvent }: any) => {
        const { width } = nativeEvent.layout;
        setNativeEventWidth(width);
        !itemSize && setItemSize(width / 5);
    };

    // @ts-ignore
    const renderItem = ({ item, index }) => {
        const makeAnimated = (a: number, b: number, c: number) => {
            return {
                inputRange: [...data.map((_: any, i: number) => i * itemSize)],
                outputRange: [
                    ...data.map((_: any, i: number) => {
                        const center = i + 2;
                        if (center === index) {
                            return a;
                        } else if (
                            center + 1 === index ||
                            center - 1 === index
                        ) {
                            return b;
                        }
                        return c;
                    }),
                ],
            };
        };

        return (
            <Animated.View
                style={[
                    {
                        width: itemSize,
                        opacity: scrollAnimatedValue.interpolate(
                            makeAnimated(1, 0.6, 0.3),
                        ),
                        transform: [
                            {
                                scale: scrollAnimatedValue.interpolate(
                                    makeAnimated(1.2, 0.9, 0.8),
                                ),
                            },
                            {
                                scaleX: I18nManager.isRTL ? -1 : 1,
                            },
                        ],
                    },
                    style.listItem,
                ]}
            >
                <Text style={style.listItemText}>
                    {utils.toPersianNumber(
                        String(item).length === 1 ? `0${item}` : item,
                    )}
                </Text>
            </Animated.View>
        );
    };

    return (
        <View style={style.row} onLayout={changeItemWidth}>
            <Text style={style.title}>{title}</Text>
            <AnimatedFlatList
                ref={flatListRef}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                snapToInterval={itemSize}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: { x: scrollAnimatedValue },
                            },
                        },
                    ],
                    {
                        useNativeDriver: true,
                    },
                )}
                data={I18nManager.isRTL ? data.reverse() : data}
                onMomentumScrollEnd={() => {
                    const index = Math.round(active.current / itemSize);
                    onChange(data[index + 2]);
                }}
                keyExtractor={(_, i) => String(i)}
                renderItem={renderItem}
                inverted={I18nManager.isRTL}
                contentContainerStyle={
                    I18nManager.isRTL && {
                        transform: [
                            {
                                scaleX: -1,
                            },
                        ],
                    }
                }
            />
        </View>
    );
};

const SelectTime = () => {
    const {
        options,
        state,
        utils,
        interval,
        min,
        max,
        mode,
        onChange,
        current,
    } = useCalendar();
    const [mainState, setMainState] = state;
    const [show, setShow] = useState(false);
    const [isValidTime, setValidTime] = useState(true);
    const [time, setTime] = useState(new Date());
    const style = styles(options);
    const openAnimation = useRef(new Animated.Value(0)).current;
    const minHour = min ? new Date(min).getHours() : 0;
    const maxHour = max ? new Date(max).getHours() : 23;
    const minMinute = min ? new Date(min).getMinutes() : 0;
    const maxMinute = max ? new Date(max).getMinutes() : 0;
    const defaultTimeWeb = current
        ? utils.formatTime(current)
        : utils.formatTime(min);
    const currentHour = current ? new Date(current).getHours() : null;
    const currentMinute = current ? new Date(current).getMinutes() : null;

    useEffect(() => {
        show && setTime(new Date(new Date().setHours(minHour, minMinute, 0)));
    }, [minHour, show, minMinute]);

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

    function numberRange(start: number | any, end: number) {
        if (start > end) {
            // eslint-disable-next-line no-param-reassign
            start = [end, start];
        }

        return (
            Array(end - start + 1)
                // @ts-ignore
                .fill()
                .map((_, idx) => start + idx)
        );
    }

    const selectTime = () => {
        const newTime = new Date(
            new Date().setHours(time.getHours(), time.getMinutes(), 0),
        );
        const newTimeForActiveDate = new Date(
            new Date(mainState.activeDate).setHours(
                time.getHours(),
                time.getMinutes(),
                0,
            ),
        );
        setMainState({
            type: 'set',
            activeDate: utils.formatTime(newTimeForActiveDate),
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
        onChange && onChange(newTime);
        mode !== 'time' &&
            setMainState({
                type: 'toggleTime',
            });
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

    const minMinutes = min ? new Date(min).getMinutes() : 0;
    const maxMinutes = max ? new Date(max).getMinutes() : 0;

    function getMinutesArray(minimum = 0, maximum = 59) {
        if (interval) {
            return numberRange(minimum, maximum).filter((n) => !(n % Number(interval)));
        }
        return numberRange(minimum, maximum);
    }

    function returnMinutes() {
        switch (time.getHours()) {
            case minHour:
                return getMinutesArray(minMinutes);
            case maxHour:
                return getMinutesArray(0, maxMinutes);
            default:
                return getMinutesArray();
        }
    }

    // eslint-disable-next-line no-shadow
    function updateTime(time: Date | number, isHour?: boolean) {
        let newTime: Date = new Date(time);
        if (isHour) {
            const curMinutes = new Date(time).getMinutes();
            const newHour = new Date(time).getHours();
            if (newHour === minHour) {
                // @ts-ignore
                if (curMinutes < new Date(minimum).getMinutes()) {
                    newTime = new Date(newTime.setHours(newHour, minMinute));
                }
            } else if (newHour === maxHour) {
                // @ts-ignore
                if (curMinutes > new Date(maximum).getMinutes()) {
                    newTime = new Date(newTime.setHours(newHour, maxMinute));
                }
            }
        }
        const isValidated = utils.validateTimeMinMax(
            new Date(newTime),
            min,
            max,
        );
        setValidTime(isValidated);
        setTime(new Date(newTime));
    }

    return show ? (
        <Animated.View style={containerStyle}>
            {Platform.OS === 'web' ? (
                <View style={style.row}>
                    <UILabel>{`Please choose time from ${utils.formatTime(
                        min,
                    )} to ${utils.formatTime(max)}`}</UILabel>
                    <TimeInput current={defaultTimeWeb} onChange={updateTime} />
                </View>
            ) : (
                <>
                    <TimeScroller
                        title={utils.config.hour}
                        data={numberRange(minHour, maxHour)}
                        onChange={(hour: number) =>
                            updateTime(time.setHours(hour), true)
                        }
                        current={currentHour}
                    />
                    <TimeScroller
                        title={utils.config.minute}
                        data={returnMinutes()}
                        onChange={(minute: number) =>
                            updateTime(time.setMinutes(minute), false)
                        }
                        current={currentMinute}
                    />
                </>
            )}
            <View style={style.footer}>
                <UIBoxButton
                    disabled={Platform.OS === 'web' ? !isValidTime : false}
                    onPress={selectTime}
                    title={utils.config.timeSelect}
                />
                {mode !== 'time' && (
                    <UIBoxButton
                        onPress={() =>
                            setMainState({
                                type: 'toggleTime',
                            })
                        }
                        title={utils.config.timeClose}
                    />
                )}
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
        title: {
            fontSize: theme.textHeaderFontSize,
            color: theme.mainColor,
        },
        listItem: {
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
        },
        listItemText: {
            fontSize: theme.textHeaderFontSize,
            color: theme.textDefaultColor,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 8,
            backgroundColor: theme.mainColor,
            margin: 8,
        },
        btnText: {
            fontSize: theme.textFontSize,
            color: theme.selectedTextColor,
        },
        cancelButton: {
            backgroundColor: theme.textSecondaryColor,
        },
    });

export { SelectTime };
