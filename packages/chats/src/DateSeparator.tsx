import * as React from "react";
import { View, StyleSheet } from "react-native";
import dayjs from "dayjs";

import { UIStyle, UIColor, UIConstant } from "@tonlabs/uikit.core";
import { UILabel } from "@tonlabs/uikit.components";

const getLabel = (time: number) => {
    const today = new Date();
    const providedTime = new Date(time); // time provided without ms
    today.setHours(0, 0, 0, 0);
    providedTime.setHours(0, 0, 0, 0);
    const todayTimeMs = today.getTime();
    const providedTimeMs = providedTime.getTime();

    if (todayTimeMs === providedTimeMs) {
        return "today"; // TODO: use localized
    }
    if (todayTimeMs - providedTimeMs === 24 * 3600 * 1000) {
        return "yesterday"; // TODO: use localized
    }

    return dayjs(time).fromNow();
};

export const DateSeparator = React.memo(({ time }: { time: number }) => (
    <View style={styles.container}>
        <View style={styles.dateSeparator}>
            <UILabel
                role={UILabel.Role.TinyRegular}
                style={UIStyle.color.getColorStyle(UIColor.textTertiary())}
                text={getLabel(time)}
            />
        </View>
    </View>
));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: UIConstant.contentOffset(),
        paddingBottom: UIConstant.contentOffset(),
    },
    dateSeparator: {
        flexShrink: 1,
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        paddingVertical: UIConstant.tinyContentOffset() / 2, // TODO: use specified value instead of calculation
        paddingHorizontal: UIConstant.smallContentOffset(),
        borderRadius: UIConstant.smallCellHeight() / 2, // TODO: use specified value instead of calculation
    },
});
