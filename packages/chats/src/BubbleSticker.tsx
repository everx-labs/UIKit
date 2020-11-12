import * as React from "react";
import { StyleSheet, View, Text } from "react-native";

import { UIConstant, UIColor, UIFont, UIStyle } from "@uikit/core";
import { uiLocalized } from "@tonlabs/uikit.localization";
import { UIImage } from "@uikit/components";

import { ChatMessageStatus } from "./types";
import type { StickerMessage } from "./types";
import { useBubblePosition, BubblePosition } from "./useBubblePosition";

const getBubbleContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
};

export const BubbleSticker = (props: StickerMessage) => {
    const position = useBubblePosition(props.status);

    return (
        <View style={getBubbleContainer(position)}>
            <View style={styles.inner}>
                <View
                    style={[
                        UIStyle.Common.flex(),
                        props.status === ChatMessageStatus.Pending &&
                            UIStyle.common.opacity70(),
                    ]}
                >
                    <UIImage style={styles.sticker} source={props.source} />
                </View>
                <View
                    style={[
                        styles.time,
                        props.status === ChatMessageStatus.Pending &&
                            UIStyle.common.opacity70(),
                    ]}
                >
                    <Text
                        // testID={testID} TODO: do we need it here?
                        style={[UIFont.tinyRegular(), styles.timeText]}
                    >
                        {uiLocalized.formatTime(props.time || Date.now())}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerRight: {
        paddingLeft: "20%",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    containerLeft: {
        paddingRight: "20%",
        alignSelf: "flex-start",
        justifyContent: "flex-start",
    },
    inner: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
    sticker: {
        width: UIConstant.giantCellHeight(),
        height: UIConstant.giantCellHeight(),
    },
    time: {
        marginRight: UIConstant.horizontalContentOffset(),
        // bottom: UIConstant.verticalContentOffset(),
        borderRadius: 10,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
        backgroundColor: UIColor.backgroundWhiteLight(),
    },
    timeText: {
        textAlign: "right",
        alignSelf: "flex-end",
        color: UIColor.black(),
    },
});
