import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

const getLabel = (time: number) => {
    const today = new Date();
    const providedTime = new Date(time); // time provided without ms
    today.setHours(0, 0, 0, 0);
    providedTime.setHours(0, 0, 0, 0);
    const todayTimeMs = today.getTime();
    const providedTimeMs = providedTime.getTime();

    if (todayTimeMs === providedTimeMs) {
        return uiLocalized.Chats.DateSeparators.Today;
    }
    if (todayTimeMs - providedTimeMs === 24 * 3600 * 1000) {
        return uiLocalized.Chats.DateSeparators.Yesterday;
    }

    // @ts-ignore seems some plugin is used
    // Do we need to setup it in our package instead?
    // Or it seems won't work wothout it
    return dayjs(time).fromNow();
};

export const DateSeparator = React.memo(({ time }: { time: number }) => {
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.dateSeparator,
                    {
                        backgroundColor: theme[ColorVariants.BackgroundSecondary],
                    },
                ]}
            >
                <UILabel role={UILabelRoles.HeadlineLabel} color={UILabelColors.TextSecondary}>
                    {getLabel(time)}
                </UILabel>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: UILayoutConstant.contentInsetVerticalX4,
        paddingBottom: UILayoutConstant.contentInsetVerticalX4,
    },
    dateSeparator: {
        flexShrink: 1,
        justifyContent: 'center',
        height: UILayoutConstant.smallCellHeight,
        paddingVertical: UILayoutConstant.contentInsetVerticalX1 / 2, // TODO: use specified value instead of calculation
        paddingHorizontal: UILayoutConstant.smallContentOffset,
        borderRadius: UILayoutConstant.smallCellHeight / 2, // TODO: use specified value instead of calculation
    },
});
