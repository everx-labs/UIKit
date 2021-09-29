import React, { useEffect, useRef, useState } from 'react';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    View,
    StyleSheet,
    Text,
    Animated,
    TouchableOpacity,
    Easing,
    Image,
    TextInput,
    I18nManager,
} from 'react-native';

import { useCalendar } from '../calendarContext';

export const SelectMonth = () => {
    const {
        options,
        state: { activeDate, monthOpen },
        dispatch,
        utils,
        selectorStartingYear,
        selectorEndingYear,
        mode,
        min,
        max,
        onMonthYearChange,
    } = useCalendar();
    const [show, setShow] = useState(false);
    const style = styles(options);
    const [year, setYear] = useState(utils.getMonthYearText(activeDate).split(' ')[1]);
    const openAnimation = useRef(new Animated.Value(0)).current;
    const currentMonth = new Date(activeDate).getMonth();
    const prevDisable = max && utils.checkYearDisabled(Number(year), true);
    const nextDisable = min && utils.checkYearDisabled(Number(year), false);

    useEffect(() => {
        monthOpen && setShow(true);
        Animated.timing(openAnimation, {
            toValue: monthOpen ? 1 : 0,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.bezier(0.17, 0.67, 0.46, 1),
        }).start(() => {
            !monthOpen && setShow(false);
        });
    }, [monthOpen, openAnimation]);

    useEffect(() => {
        show && setYear(utils.getMonthYearText(activeDate).split(' ')[1]);
    }, [activeDate, utils, show]);

    const onSelectMonth = (month: any) => {
        if (show) {
            const y = Number(year);
            const date = utils.getDate(utils.validYear(activeDate, y));
            const activeDate = month !== null ? date.month(month) : date;
            dispatch({
                type: 'set',
                payload: {
                    activeDate: utils.getFormatted(activeDate),
                },
            });
            month !== null &&
                onMonthYearChange?.(utils.getFormatted(activeDate, 'monthYearFormat'));
            month !== null &&
                mode !== 'monthYear' &&
                dispatch({
                    type: 'toggleMonth',
                });
        }
    };

    useEffect(() => {
        onSelectMonth(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevDisable, nextDisable]);

    const onChangeYear = (text: string) => {
        if (Number(text)) {
            setYear(text);
        }
    };

    const onSelectYear = (number: number) => {
        let y = Number(year) + number;
        if (selectorEndingYear && y > selectorEndingYear) {
            y = selectorEndingYear;
        } else if (selectorStartingYear && y < selectorStartingYear) {
            y = selectorStartingYear;
        }
        setYear(y);
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
            <View style={[style.header, I18nManager.isRTL && style.reverseHeader]}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.arrowWrapper}
                    onPress={() => !nextDisable && onSelectYear(-1)}
                >
                    <Image
                        source={UIAssets.icons.ui.arrowLeft}
                        style={[style.arrow, nextDisable && style.disableArrow]}
                    />
                </TouchableOpacity>
                <TextInput
                    style={style.yearInput}
                    keyboardType="numeric"
                    maxLength={4}
                    value={year}
                    onBlur={() => onSelectYear(0)}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    returnKeyType="done"
                    autoCorrect={false}
                    blurOnSubmit
                    selectionColor={options.mainColor}
                    onChangeText={onChangeYear}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.arrowWrapper}
                    onPress={() => !prevDisable && onSelectYear(+1)}
                >
                    <Image
                        source={UIAssets.icons.ui.arrowLeft}
                        style={[style.arrow, style.rightArrow, prevDisable && style.disableArrow]}
                    />
                </TouchableOpacity>
            </View>

            <View style={[style.monthList]}>
                {[...Array(12).keys()].map(item => {
                    const disabled = utils.checkSelectMonthDisabled(activeDate, item);
                    return (
                        <TouchableOpacity
                            key={item}
                            activeOpacity={0.8}
                            style={[style.item, currentMonth === item && style.selectedItem]}
                            onPress={() => !disabled && onSelectMonth(item)}
                        >
                            <Text
                                style={[
                                    style.itemText,
                                    currentMonth === item && style.selectedItemText,
                                    disabled && style.disabledItemText,
                                ]}
                            >
                                {utils.getMonthName(item)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
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
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            alignItems: 'center',
            paddingHorizontal: 15,
            justifyContent: 'space-between',
            width: '80%',
            flexDirection: 'row',
        },
        reverseHeader: {
            flexDirection: 'row-reverse',
        },
        monthList: {
            flexWrap: 'wrap',
            margin: 25,
            flexDirection: 'row',
        },
        item: {
            width: '30%',
            marginHorizontal: '1.5%',
            paddingVertical: 8,
            marginVertical: 7,
            alignItems: 'center',
        },
        selectedItem: {
            backgroundColor: theme.mainColor,
            borderRadius: 12,
        },
        itemText: {
            fontFamily: theme.defaultFont,
            fontSize: theme.textFontSize,
            color: theme.textDefaultColor,
        },
        selectedItemText: {
            color: theme.selectedTextColor,
        },
        disabledItemText: {
            opacity: 0.2,
        },
        arrowWrapper: {
            padding: 13,
            position: 'relative',
            zIndex: 1,
            opacity: 1,
        },
        disableArrow: {
            opacity: 0,
        },
        arrow: {
            width: 18,
            height: 18,
            opacity: 0.9,
            tintColor: theme.mainColor,
            margin: 2,
        },
        rightArrow: {
            transform: [
                {
                    rotate: '180deg',
                },
            ],
        },
        arrowDisable: {
            opacity: 0,
        },
        yearInput: {
            fontSize: theme.textHeaderFontSize,
            paddingVertical: 2,
            paddingHorizontal: 4,
            color: theme.textHeaderColor,
            fontFamily: theme.headerFont,
            textAlignVertical: 'center',
            minWidth: 100,
            textAlign: 'center',
        },
    });
