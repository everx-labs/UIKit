import React, { useState } from 'react';
import { View } from 'react-native';
import { makeStyles, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.hydrogen';

import { useCalendar } from '../calendarContext';
import { ArrowsButtons, MonthYearButton } from './Controls';
import { PickerActionName, UIDateTimePickerMode } from '../../../types';

export const Header = ({ changeMonth }: any) => {
    const { options, disableDateChange, state, dispatch, utils, min, max, mode } = useCalendar();

    const theme = useTheme();
    const styles = useStyles(theme);
    const [disableChange, setDisableChange] = useState(false);
    const { lastDate, changeMonthAnimation } = utils.useMonthAnimation(
        state.activeDate,
        options && options.headerAnimationDistance,
        () => setDisableChange(false),
    );
    const prevDisable =
        disableDateChange || (min && utils.checkArrowMonthDisabled(state.activeDate, true));
    const nextDisable =
        disableDateChange || (max && utils.checkArrowMonthDisabled(state.activeDate, false));

    const onChangeMonth = React.useCallback(
        (type: string) => {
            if (disableChange) return;
            setDisableChange(true);
            changeMonthAnimation(type);
            const modificationNumber = type === 'NEXT' ? 1 : -1;
            const newDate = utils.getDate(state.activeDate).add(modificationNumber, 'month');
            dispatch({
                type: PickerActionName.Set,
                payload: {
                    activeDate: utils.getFormatted(newDate),
                },
            });
            changeMonth(type);
        },
        [changeMonth, changeMonthAnimation, disableChange, dispatch, state.activeDate, utils],
    );

    const onPrevMonth = React.useCallback(() => {
        !prevDisable && onChangeMonth('PREVIOUS');
    }, [onChangeMonth, prevDisable]);

    const onNextMonth = React.useCallback(() => {
        !nextDisable && onChangeMonth('NEXT');
    }, [onChangeMonth, nextDisable]);

    const onPressMonth = React.useCallback(() => {
        !disableDateChange &&
            dispatch({
                type: PickerActionName.ToggleMonth,
            });
    }, [disableDateChange, dispatch]);

    const returnTitle = React.useCallback(() => {
        switch (mode) {
            case UIDateTimePickerMode.Date:
                return '';
            case UIDateTimePickerMode.DateTime:
                return '';
            default:
                return '';
        }
    }, [mode]);

    return (
        <View style={styles.container}>
            <UILabel role={TypographyVariants.TitleMedium}>{returnTitle}</UILabel>
            <View style={styles.controlsContainer}>
                <MonthYearButton
                    onPressMonth={onPressMonth}
                    onPressYear={() => console.log('todo: year view')}
                    month={utils.getMonthYearText(lastDate).split(' ')[0]}
                    year={utils.getMonthYearText(state.activeDate).split(' ')[1]}
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
