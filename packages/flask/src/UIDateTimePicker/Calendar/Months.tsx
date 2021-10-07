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

import { MonthCells, useMonths } from './useCalendar';

import { UIConstant } from '../../constants';

function getMonthLabelRole(disabled: boolean, isSelected: boolean) {
    if (disabled) {
        return UILabelRoles.Action;
    }
    if (isSelected) {
        return UILabelRoles.HeadlineHead;
    }
    return UILabelRoles.Action;
}

function getMonthLabelColor(disabled: boolean, isSelected: boolean) {
    if (disabled) {
        return UILabelColors.TextTertiary;
    }
    if (isSelected) {
        return UILabelColors.TextAccent;
    }
    return UILabelColors.TextPrimary;
}

const MonthsColumn = React.memo(function MonthColumn({
    items,
    selected,
    selectedRow,
    minMonth,
    maxMonth,
    onSelect,
}: {
    items: MonthCells[];
    selected: boolean;
    selectedRow: number;
    minMonth: number;
    maxMonth: number;
    onSelect: (month: number) => void;
}) {
    const theme = useTheme();
    return (
        <View style={styles.column}>
            {items.map(({ id, label }, index) => {
                const isSelected = selected && index === selectedRow;
                const disabled = id < minMonth || id > maxMonth;
                const labelRole = getMonthLabelRole(disabled, isSelected);
                const labelColor = getMonthLabelColor(disabled, isSelected);
                return (
                    <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={[
                            styles.month,
                            isSelected &&
                                !disabled && {
                                    backgroundColor: theme[ColorVariants.StaticBackgroundAccent],
                                },
                        ]}
                        disabled={disabled}
                        onPress={() => onSelect(id)}
                        activeOpacity={0.8}
                    >
                        <UILabel role={labelRole} color={labelColor}>
                            {label}
                        </UILabel>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

export const Months = React.memo(function Months() {
    const { monthsMatrix, currentRow, currentColumn, minMonth, maxMonth, onSelect } = useMonths();

    return (
        <View style={styles.monthContainer}>
            {monthsMatrix.map((column, index) => (
                <MonthsColumn
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    items={column}
                    selected={index === currentColumn}
                    selectedRow={currentRow}
                    minMonth={minMonth}
                    maxMonth={maxMonth}
                    onSelect={onSelect}
                />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    column: { flex: 1 },
    monthContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: UIConstant.contentOffset,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    month: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
    },
});
