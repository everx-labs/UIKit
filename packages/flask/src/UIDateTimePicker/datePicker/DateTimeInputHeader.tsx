import React from 'react';
import { View } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UILabel,
    UILinkButton,
    useTheme,
} from '@tonlabs/uikit.hydrogen';

import dayjs from 'dayjs';
import { useCalendar } from './calendarContext';

export function DateTimeInputHeader({ mode }: { mode: any }) {
    const { onClose, onChange, state } = useCalendar();
    const [mainState] = state;

    const [title, setTitle] = React.useState('');

    const theme = useTheme();
    const styles = useStyles(theme);

    const onPressDone = React.useCallback(() => {
        console.log(mainState.time, dayjs(mainState.time).toDate());
        onChange && onChange(dayjs(mainState.time).toDate());
    }, [onChange, mainState]);

    React.useEffect(() => {
        switch (mode) {
            case 'time':
                // @ts-ignore
                setTitle(uiLocalized.DateTimePicker.ChooseTime);
                break;
            case 'datepicker':
                // @ts-ignore
                setTitle(uiLocalized.DateTimePicker.ChooseDateTime);
                break;
            default:
                // @ts-ignore todo: something wrong with my ts (Eremina M.)
                setTitle(uiLocalized.DateTimePicker.ChooseDate);
                break;
        }
    }, [mode]);

    return (
        <View style={styles.header}>
            <UILinkButton onPress={onClose} title={uiLocalized.Cancel} />
            <UILabel role={TypographyVariants.HeadlineHead} style={styles.headerTitle}>
                {title}
            </UILabel>
            <UILinkButton
                disabled={!mainState.isValidDateTime}
                onPress={onPressDone}
                title={uiLocalized.Done}
            />
        </View>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme[ColorVariants.BackgroundTertiary] as string,
        paddingHorizontal: 16,
    },
    headerTitle: {
        textAlign: 'center',
        flex: 3,
    },
}));
