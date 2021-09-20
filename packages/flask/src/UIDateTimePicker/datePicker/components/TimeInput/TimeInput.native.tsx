import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, I18nManager, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ColorVariants, UILabel } from '@tonlabs/uikit.hydrogen';
import type { TimeInputProps } from './types';
import { useCalendar } from '../../calendarContext';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TimeScroller = ({ title, data, onChange, current }: any) => {
    const { options } = useCalendar();
    const [itemSize, setItemSize] = useState(0);
    const [nativeEventWidth, setNativeEventWidth] = useState(0);
    const style = styles(options);
    const scrollAnimatedValue = useRef(new Animated.Value(0)).current;
    const scrollListener = useRef();
    const active = useRef(0);
    const flatListRef = useRef();

    // eslint-disable-next-line no-param-reassign
    data = ['', '', ...data, '', ''];

    useEffect(() => {
        onChange(current && data.length > 5 ? data[getIndexOfCurrentItem()] : data[2]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTimeout(() => {
            getOffsetOfCurrent();
        }, 400);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nativeEventWidth]);

    useEffect(() => {
        scrollListener.current && clearInterval(scrollListener.current);
        // @ts-expect-error
        scrollListener.current = scrollAnimatedValue.addListener(
            // eslint-disable-next-line no-return-assign
            ({ value }) => (active.current = value),
        );

        return () => {
            clearInterval(scrollListener.current);
        };
    }, [scrollAnimatedValue]);

    const getIndexOfCurrentItem = () => {
        const closest = data.reduce((prevVal: number, currVal: number) => {
            return Math.abs(currVal - current) < Math.abs(prevVal - current) ? currVal : prevVal;
        });
        const currentIndex = () => data.findIndex((i: number) => i === closest);
        return currentIndex() > 0 ? currentIndex() : 2;
    };

    const getOffsetOfCurrent = useCallback(() => {
        if (nativeEventWidth > 0) {
            const offset = Math.round((getIndexOfCurrentItem() - 2) * (nativeEventWidth / 5));
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
                        } else if (center + 1 === index || center - 1 === index) {
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
                        opacity: scrollAnimatedValue.interpolate(makeAnimated(1, 0.6, 0.3)),
                        transform: [
                            {
                                scale: scrollAnimatedValue.interpolate(makeAnimated(1.2, 0.9, 0.8)),
                            },
                            {
                                scaleX: I18nManager.isRTL ? -1 : 1,
                            },
                        ],
                    },
                    style.listItem,
                ]}
            >
                <UILabel>{String(item).length === 1 ? `0${item}` : item}</UILabel>
            </Animated.View>
        );
    };

    return (
        <View style={style.row} onLayout={changeItemWidth}>
            <UILabel color={ColorVariants.TextAccent}>{title}</UILabel>
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

export function TimeInput({ onChange, current }: TimeInputProps) {
    const { utils, interval, min, max } = useCalendar();
    const minHour = min ? new Date(min).getHours() : 0;
    const maxHour = max ? new Date(max).getHours() : 23;
    const minMinutes = min ? new Date(min).getMinutes() : 0;
    const maxMinutes = max ? new Date(max).getMinutes() : 59;
    const currentHour = new Date(current).getHours();
    const currentMinute = new Date(current).getMinutes();

    function numberRange(start: number | any, end: number) {
        if (start > end) {
            // eslint-disable-next-line no-param-reassign
            [start, end] = [end, start];
        }

        return (
            Array(end - start + 1)
                // @ts-ignore
                .fill()
                .map((_, idx) => start + idx)
        );
    }

    function getMinutesArray(minimum = 0, maximum = 59) {
        if (interval) {
            return numberRange(minimum, maximum).filter(n => !(n % Number(interval)));
        }
        return numberRange(minimum, maximum);
    }

    const returnMinutes = () => {
        if (current.getHours() <= minHour) {
            return getMinutesArray(minMinutes);
        } else if (current.getHours() >= maxHour) {
            return getMinutesArray(0, maxMinutes);
        }
        return getMinutesArray();
    };

    function updateTime(value: number, isHour: boolean) {
        if (isHour) {
            onChange(new Date(current.setHours(value)), true);
        } else {
            onChange(new Date(current.setMinutes(value)), false);
        }
    }

    return (
        <>
            <TimeScroller
                title={utils.config.hour}
                data={numberRange(minHour, maxHour)}
                onChange={(hour: number) => updateTime(hour, true)}
                current={currentHour}
            />
            <TimeScroller
                title={utils.config.minute}
                data={returnMinutes()}
                onChange={(minute: number) => updateTime(minute, false)}
                current={currentMinute}
            />
        </>
    );
}

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
