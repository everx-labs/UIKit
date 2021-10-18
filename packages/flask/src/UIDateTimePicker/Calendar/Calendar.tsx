import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    TouchableOpacity,
    PortalManager,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { Header } from './Header';

import { DayCells, useDaysCalendar, useAditionalCalendars } from './useCalendar';
import { UIConstant } from '../../constants';
import { Layer } from './Layer';
import { Months } from './Months';
import { Years } from './Years';

function getDayLabelRole(isSelected: boolean) {
    if (isSelected) {
        return UILabelRoles.HeadlineHead;
    }
    return UILabelRoles.Action;
}

function getDayLabelColor(disabled: boolean, isSelected: boolean) {
    if (isSelected) {
        return UILabelColors.TextAccent;
    }
    if (disabled) {
        return UILabelColors.TextTertiary;
    }
    return UILabelColors.TextPrimary;
}

const Column = React.memo(function Column({
    id,
    items,
    selected,
    selectedRow,
    onSelect,
}: {
    id: number;
    items: DayCells[];
    selected: boolean;
    selectedRow: number;
    onSelect: (column: number, row: number) => void;
}) {
    const theme = useTheme();
    return (
        <View style={styles.column}>
            {items.map((day, index) => {
                if (day.type === 'dayLabel') {
                    return (
                        <UILabel
                            key={day.label}
                            role={UILabelRoles.ActionFootnote}
                            color={ColorVariants.TextSecondary}
                        >
                            {day.label}
                        </UILabel>
                    );
                }

                if (day.type === 'dayFiller') {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <View style={styles.day} key={`${selectedRow}${index}`}>
                            <UILabel role={UILabelRoles.Action} color={UILabelColors.TextPrimary}>
                                {' '}
                            </UILabel>
                        </View>
                    );
                }

                const isSelected = selected && index === selectedRow;
                const labelRole = getDayLabelRole(isSelected);
                const labelColor = getDayLabelColor(day.disabled, isSelected);

                return (
                    <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${selectedRow}${index}`}
                        style={[
                            styles.day,
                            isSelected && {
                                backgroundColor: theme[ColorVariants.StaticBackgroundAccent],
                            },
                        ]}
                        disabled={day.disabled || isSelected}
                        onPress={() => onSelect(id, index)}
                        activeOpacity={0.8}
                    >
                        <UILabel role={labelRole} color={labelColor}>
                            {day.dayString}
                        </UILabel>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

export function Calendar() {
    const {
        activeDayColumn,
        activeDayRow,
        daysMatrix,
        month,
        year,
        onSelect,
        onPrev: onPrevDay,
        onNext: onNextDay,
    } = useDaysCalendar();
    const {
        isMonthsVisible,
        openMonths,
        isYearsVisible,
        openYears,
        onPrevMonth,
        onNextMonth,
        onPrevYear,
        onNextYear,
    } = useAditionalCalendars();

    const headerTitle = React.useMemo(() => {
        if (isYearsVisible) {
            return uiLocalized.DateTimePicker.Year;
        }
        if (isMonthsVisible) {
            return uiLocalized.DateTimePicker.Month;
        }
        return uiLocalized.DateTimePicker.Day;
    }, [isYearsVisible, isMonthsVisible]);

    const onPrev = React.useMemo(() => {
        if (isYearsVisible) {
            return onPrevYear;
        }
        if (isMonthsVisible) {
            return onPrevMonth;
        }
        return onPrevDay;
    }, [isYearsVisible, isMonthsVisible, onPrevDay, onPrevMonth, onPrevYear]);

    const onNext = React.useMemo(() => {
        if (isYearsVisible) {
            return onNextYear;
        }
        if (isMonthsVisible) {
            return onNextMonth;
        }
        return onNextDay;
    }, [isYearsVisible, isMonthsVisible, onNextDay, onNextMonth, onNextYear]);

    return (
        <>
            <Header
                title={headerTitle}
                onPressMonth={openMonths}
                onPressYear={openYears}
                onPrev={onPrev}
                onNext={onNext}
                month={isMonthsVisible || isYearsVisible ? undefined : month}
                year={isYearsVisible ? undefined : year}
            />
            <View style={styles.container}>
                <PortalManager id="calendar">
                    {daysMatrix.map((column, index) => (
                        <Column
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            id={index}
                            selected={index === activeDayColumn}
                            selectedRow={activeDayRow}
                            items={column}
                            onSelect={onSelect}
                        />
                    ))}
                    <Layer visible={isMonthsVisible}>{() => <Months />}</Layer>
                    <Layer visible={isYearsVisible}>{() => <Years />}</Layer>
                </PortalManager>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: UIConstant.contentOffset,
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    day: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
        width: UIConstant.calendar.daySize,
        height: UIConstant.calendar.daySize,
    },
});
