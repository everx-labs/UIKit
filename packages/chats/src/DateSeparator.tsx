import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { UIColor, UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

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

export const DateSeparator = React.memo(({ time }: { time: number }) => (
    <View style={styles.container}>
        <View style={styles.dateSeparator}>
            <UILabel
                role={UILabelRoles.ActionFootnote}
                color={UILabelColors.TextTertiary}
            >
                {getLabel(time)}
            </UILabel>
        </View>
    </View>
));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: UIConstant.contentOffset(),
        paddingBottom: UIConstant.contentOffset(),
    },
    dateSeparator: {
        flexShrink: 1,
        justifyContent: 'center',
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        paddingVertical: UIConstant.tinyContentOffset() / 2, // TODO: use specified value instead of calculation
        paddingHorizontal: UIConstant.smallContentOffset(),
        borderRadius: UIConstant.smallCellHeight() / 2, // TODO: use specified value instead of calculation
    },
});
