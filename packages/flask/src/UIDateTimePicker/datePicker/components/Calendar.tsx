import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    TouchableOpacity,
} from '@tonlabs/uikit.hydrogen';

import { useCalendar, DayCells } from '../useCalendar';
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
                        {
                            <UILabel
                                role={isSelected ? UILabelRoles.HeadlineHead : UILabelRoles.Action}
                                color={
                                    isSelected
                                        ? UILabelColors.TextAccent
                                        : UILabelColors.TextPrimary
                                }
                            >
                                {day.dayString}
                            </UILabel>
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

export function Calendar() {
    const { activeDayColumn, activeDayRow, daysMatrix, onSelect } = useCalendar();

    return (
        <View style={styles.container}>
            {/* <Header changeMonth={changeMonthAnimation} /> */}
            {daysMatrix.map((column, index) => (
                <Column
                    key={index}
                    id={index}
                    selected={index === activeDayColumn}
                    selectedRow={activeDayRow}
                    items={column}
                    onSelect={onSelect}
                />
            ))}
        </View>
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
});
