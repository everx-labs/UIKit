import React from 'react';
import { View } from 'react-native';
import { makeStyles, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { ArrowsButtons, MonthYearButton } from './DateControls';

export function Header({
    title,
    onPressYear,
    onPressMonth,
    onPrev,
    onNext,
    month,
    year,
}: {
    title: string;
    onPressYear: () => void;
    onPressMonth: () => void;
    onPrev: () => void;
    onNext: () => void;
    month?: string;
    year?: string;
}) {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.container}>
            <UILabel role={TypographyVariants.TitleMedium}>{title}</UILabel>
            <View style={styles.controlsContainer}>
                <MonthYearButton
                    onPressMonth={onPressMonth}
                    onPressYear={onPressYear}
                    month={month}
                    year={year}
                />
                <ArrowsButtons onPressLeft={onPrev} onPressRight={onNext} />
            </View>
        </View>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'space-between',
    },
    controlsContainer: {
        flexDirection: 'row',
    },
}));
