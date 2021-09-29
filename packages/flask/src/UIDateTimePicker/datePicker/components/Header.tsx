import React from 'react';
import { View } from 'react-native';
import { makeStyles, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.hydrogen';

import { useCalendar } from '../calendarContext';
import { ArrowsButtons, MonthYearButton } from './Controls';
import { PickerActionName } from '../../../types';

export const Header = ({ changeMonth, title }: any) => {
    const { options, disableDateChange, state, dispatch, utils, min, max } = useCalendar();

    const theme = useTheme();
    const styles = useStyles(theme);
    const [disableChange, setDisableChange] = React.useState(false);

    const { lastDate, changeMonthAnimation } = React.useMemo(
        () =>
            utils.useMonthAnimation(
                state.activeDate,
                options && options.headerAnimationDistance,
                () => setDisableChange(false),
            ),
        [options, state.activeDate, utils],
    );

    const prevDisable = React.useMemo(
        () => disableDateChange || (min && utils.checkArrowMonthDisabled(state.activeDate, true)),
        [disableDateChange, min, state.activeDate, utils],
    );

    const nextDisable = React.useMemo(
        () => disableDateChange || (max && utils.checkArrowMonthDisabled(state.activeDate, false)),
        [disableDateChange, max, state.activeDate, utils],
    );

    const currentMonth = React.useMemo(
        () => utils.getMonthYearText(lastDate).split(' ')[0],
        [lastDate, utils],
    );
    const currentYear = React.useMemo(
        () => utils.getMonthYearText(state.activeDate).split(' ')[1],
        [state.activeDate, utils],
    );

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

    return (
        <View style={styles.container}>
            <UILabel role={TypographyVariants.TitleMedium}>{title}</UILabel>
            <View style={styles.controlsContainer}>
                <MonthYearButton
                    onPressMonth={onPressMonth}
                    onPressYear={() => console.log('todo: year view')}
                    month={currentMonth}
                    year={currentYear}
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
