import * as React from 'react';
import { View, StyleSheet, FlatList as RNFlatList } from 'react-native';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
} from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { FlatList } from '@tonlabs/uikit.scrolls';

import { useYears } from './useCalendar';

import { UIConstant } from '../../constants';

const YEAR_ROW_HEIGHT = 34 + UILayoutConstant.contentOffset;

function getYearLabelRole(disabled: boolean, isSelected: boolean) {
    if (disabled) {
        return UILabelRoles.Action;
    }
    if (isSelected) {
        return UILabelRoles.HeadlineHead;
    }
    return UILabelRoles.Action;
}

function getYearLabelColor(disabled: boolean, isSelected: boolean) {
    if (disabled) {
        return UILabelColors.TextTertiary;
    }
    if (isSelected) {
        return UILabelColors.TextAccent;
    }
    return UILabelColors.TextPrimary;
}

export const Years = React.memo(function Years() {
    const { yearsMatrix, selectedRow, selectedYear, minYear, maxYear, onSelect } = useYears();
    const theme = useTheme();
    const listRef = React.useRef<any>(null);

    React.useEffect(() => {
        (listRef?.current as RNFlatList)?.scrollToIndex({ index: Math.max(selectedRow - 2, 0) });
    }, [listRef, selectedRow]);

    return (
        <FlatList
            ref={listRef}
            style={styles.list}
            data={yearsMatrix}
            keyExtractor={item => `${item[0]}`}
            getItemLayout={(_, index) => ({
                length: YEAR_ROW_HEIGHT,
                offset: YEAR_ROW_HEIGHT * index,
                index,
            })}
            renderItem={({ item, index: rowIndex }) => (
                <View style={styles.rowWrapper}>
                    {item.map((year: number) => {
                        const isSelected = selectedRow === rowIndex && selectedYear === year;
                        const disabled = year < minYear || year > maxYear;
                        const labelRole = getYearLabelRole(disabled, isSelected);
                        const labelColor = getYearLabelColor(disabled, isSelected);

                        return (
                            <View key={year} style={styles.cellWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.cell,
                                        isSelected &&
                                            !disabled && {
                                                backgroundColor:
                                                    theme[ColorVariants.StaticBackgroundAccent],
                                            },
                                    ]}
                                    disabled={disabled}
                                    onPress={() => onSelect(year)}
                                    activeOpacity={0.8}
                                >
                                    <UILabel role={labelRole} color={labelColor}>
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

const styles = StyleSheet.create({
    list: { flex: 1 },
    rowWrapper: {
        flexDirection: 'row',
    },
    cellWrapper: {
        flex: 1,
        alignItems: 'center',
        marginTop: UILayoutConstant.contentInsetVerticalX4,
    },
    cell: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        paddingHorizontal: 29,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
