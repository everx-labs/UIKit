import React from 'react';
import { View } from 'react-native';
import type { Dayjs } from 'dayjs';
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
import { useCalendar } from '../../calendarContext';

// todo DateTimePickerHeader
export function TimeInputHeader({
    time,
    isValidTime = true,
}: {
    time: Dayjs;
    isValidTime: boolean;
}) {
    const { onClose, onChange } = useCalendar();

    const theme = useTheme();
    const styles = useStyles(theme);

    const onPressDone = React.useCallback(() => {
        onChange && onChange(time.toDate());
    }, [onChange, time]);

    return (
        <View style={styles.header}>
            <UILinkButton onPress={onClose} title={uiLocalized.Cancel} />
            <UILabel role={TypographyVariants.HeadlineHead} style={styles.headerTitle}>
                Choose Time
            </UILabel>
            <UILinkButton disabled={!isValidTime} onPress={onPressDone} title={uiLocalized.Done} />
        </View>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme[ColorVariants.BackgroundPrimary] as string,
        paddingHorizontal: 16,
    },
    headerTitle: {
        textAlign: 'center',
        flex: 3,
    },
}));
