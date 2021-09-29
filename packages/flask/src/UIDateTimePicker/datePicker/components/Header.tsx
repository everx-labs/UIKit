import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { makeStyles, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.hydrogen';

import { useCalendar } from '../calendarContext';
import { ArrowsButtons, MonthYearButton } from './Controls';

export const Header = ({ changeMonth }: any) => {
    const { options, disableDateChange, state, utils, min, max, mode } = useCalendar();
    const [mainState, setMainState] = state;
    const theme = useTheme();
    const styles = useStyles(theme);
    const [disableChange, setDisableChange] = useState(false);
    const [{ lastDate }, changeMonthAnimation] = utils.useMonthAnimation(
        mainState.activeDate,
        options && options.headerAnimationDistance,
        () => setDisableChange(false),
    );
    const prevDisable =
        disableDateChange || (min && utils.checkArrowMonthDisabled(mainState.activeDate, true));
    const nextDisable =
        disableDateChange || (max && utils.checkArrowMonthDisabled(mainState.activeDate, false));

    const onChangeMonth = React.useCallback(
        (type: string) => {
            if (disableChange) return;
            setDisableChange(true);
            changeMonthAnimation(type);
            const modificationNumber = type === 'NEXT' ? 1 : -1;
            const newDate = utils.getDate(mainState.activeDate).add(modificationNumber, 'month');
            setMainState({
                type: 'set',
                activeDate: utils.getFormatted(newDate),
            });
            changeMonth(type);
        },
        [
            changeMonth,
            changeMonthAnimation,
            disableChange,
            mainState.activeDate,
            setMainState,
            utils,
        ],
    );

    const onPrevMonth = React.useCallback(() => {
        !prevDisable && onChangeMonth('PREVIOUS');
    }, [onChangeMonth, prevDisable]);

    const onNextMonth = React.useCallback(() => {
        !nextDisable && onChangeMonth('NEXT');
    }, [onChangeMonth, nextDisable]);

    const onPressMonth = React.useCallback(() => {
        !disableDateChange &&
            setMainState({
                type: 'toggleMonth',
            });
    }, [disableDateChange, setMainState]);

    return (
        <View style={styles.container}>
            <UILabel role={TypographyVariants.TitleMedium}>Title</UILabel>
            <View style={styles.controlsContainer}>
                <MonthYearButton
                    onPressMonth={onPressMonth}
                    onPressYear={() => console.log('todo: year view')}
                    month={utils.getMonthYearText(lastDate).split(' ')[0]}
                    year={utils.getMonthYearText(mainState.activeDate).split(' ')[1]}
                />
                <ArrowsButtons onPressRight={onPrevMonth} onPressLeft={onNextMonth} />
            </View>
        </View>
    );
};

const useStyles = makeStyles(() => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
    },
    controlsContainer: {
        flexDirection: 'row',
    },
}));
