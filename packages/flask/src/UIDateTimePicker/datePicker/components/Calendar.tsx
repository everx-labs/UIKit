import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    TouchableOpacity,
    PortalManager,
    Portal,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { FlatList } from '@tonlabs/uikit.navigation';

import { Header } from './Header';

import {
    DayCells,
    useDaysCalendar,
    useAditionalCalendars,
    MonthCells,
    useMonths,
    useYears,
} from '../useCalendar';
import { UIConstant } from '../../../constants';

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
                        <View style={styles.day}>
                            <UILabel role={UILabelRoles.Action} color={UILabelColors.TextPrimary}>
                                {' '}
                            </UILabel>
                        </View>
                    );
                }

                // const isSelected = day != null && selectedDate.isSame(day.date, 'day');
                const isSelected = selected && index === selectedRow;
                return (
                    <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
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
                        <UILabel
                            role={isSelected ? UILabelRoles.HeadlineHead : UILabelRoles.Action}
                            color={
                                isSelected ? UILabelColors.TextAccent : UILabelColors.TextPrimary
                            }
                        >
                            {day.dayString}
                        </UILabel>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

function UpperLayer({ visible, children }: { visible: boolean; children: () => React.ReactNode }) {
    const [isVisible, setIsVisible] = React.useState(false);

    const dismiss = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    const opacity = useSharedValue(0);

    React.useEffect(() => {
        if (visible === isVisible) {
            return;
        }

        if (!visible) {
            opacity.value = withTiming(
                0,
                {
                    duration: 100,
                    easing: Easing.in(Easing.ease),
                },
                isFinished => {
                    if (isFinished) {
                        runOnJS(dismiss)();
                    }
                },
            );
            return;
        }

        setIsVisible(true);
        opacity.value = withSpring(1, {
            overshootClamping: true,
        });
    }, [visible, dismiss, opacity, isVisible]);

    const theme = useTheme();
    const bgColor = theme[ColorVariants.BackgroundPrimary];
    const style = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            backgroundColor: bgColor,
        };
    });

    if (!isVisible) {
        return null;
    }

    return (
        <Portal absoluteFill forId="calendar">
            <Animated.View style={[styles.layerContainer, style]}>{children()}</Animated.View>
        </Portal>
    );
}

const MonthsColumn = React.memo(function MonthColumn({
    items,
    selected,
    selectedRow,
    onSelect,
}: {
    items: MonthCells[];
    selected: boolean;
    selectedRow: number;
    onSelect: (month: number) => void;
}) {
    const theme = useTheme();
    return (
        <View style={{ flex: 1 }}>
            {items.map(({ id, label }, index) => {
                const isSelected = selected && index === selectedRow;
                return (
                    <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={[
                            styles.month,
                            isSelected && {
                                backgroundColor: theme[ColorVariants.StaticBackgroundAccent],
                            },
                        ]}
                        onPress={() => onSelect(id)}
                        activeOpacity={0.8}
                    >
                        <UILabel
                            role={isSelected ? UILabelRoles.HeadlineHead : UILabelRoles.Action}
                            color={
                                isSelected ? UILabelColors.TextAccent : UILabelColors.TextPrimary
                            }
                        >
                            {label}
                        </UILabel>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

const Months = React.memo(function Months() {
    const { monthsMatrix, currentRow, currentColumn, onSelect } = useMonths();

    return (
        <View style={styles.container}>
            {monthsMatrix.map((column, index) => (
                <MonthsColumn
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    items={column}
                    selected={index === currentColumn}
                    selectedRow={currentRow}
                    onSelect={onSelect}
                />
            ))}
        </View>
    );
});

const YEAR_ROW_HEIGHT = 34 + UIConstant.contentOffset;

const Years = React.memo(function Years() {
    const { yearsMatrix, selectedRow, selectedYear, onSelect } = useYears();
    const theme = useTheme();

    return (
        <FlatList
            style={{ flex: 1 }}
            data={yearsMatrix}
            keyExtractor={item => `${item[0]}`}
            getItemLayout={(_, index) => ({
                length: YEAR_ROW_HEIGHT,
                offset: YEAR_ROW_HEIGHT * index,
                index,
            })}
            initialScrollIndex={Math.max(selectedRow - 2, 0)}
            renderItem={({ item, index: rowIndex }) => (
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    }}
                >
                    {item.map((year: number) => {
                        const isSelected = selectedRow === rowIndex && selectedYear === year;
                        return (
                            <View
                                key={year}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    marginTop: UIConstant.contentOffset,
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.year,
                                        isSelected && {
                                            backgroundColor:
                                                theme[ColorVariants.StaticBackgroundAccent],
                                        },
                                    ]}
                                    onPress={() => onSelect(year)}
                                    activeOpacity={0.8}
                                >
                                    <UILabel
                                        role={
                                            isSelected
                                                ? UILabelRoles.HeadlineHead
                                                : UILabelRoles.Action
                                        }
                                        color={
                                            isSelected
                                                ? UILabelColors.TextAccent
                                                : UILabelColors.TextPrimary
                                        }
                                    >
                                        {year}
                                    </UILabel>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            )}
        />
    );
});

export function Calendar() {
    const { activeDayColumn, activeDayRow, daysMatrix, month, year, onSelect, onPrev, onNext } =
        useDaysCalendar();
    const { isMonthsVisible, openMonths, isYearsVisible, openYears } = useAditionalCalendars();

    const headerTitle = React.useMemo(() => {
        if (isYearsVisible) {
            return uiLocalized.DateTimePicker.Year;
        }
        if (isMonthsVisible) {
            return uiLocalized.DateTimePicker.Month;
        }
        return uiLocalized.DateTimePicker.Day;
    }, [isYearsVisible, isMonthsVisible]);

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
                    <UpperLayer visible={isMonthsVisible}>{() => <Months />}</UpperLayer>
                    <UpperLayer visible={isYearsVisible}>{() => <Years />}</UpperLayer>
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
        aspectRatio: 1,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
    },
    month: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
    },
    year: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        paddingHorizontal: 29,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },
    layerContainer: {
        flex: 1,
    },
});
