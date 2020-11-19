import * as React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import { UIConstant, UIColor, UITextStyle } from "@tonlabs/uikit.core";

import type { ActionButtonMessage } from "./types";
import { useBubblePosition, BubblePosition } from "./useBubblePosition";

const getButtonContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
};

const getButtonRadius = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.buttonLeft;
    } else if (position === BubblePosition.right) {
        return styles.buttonRight;
    }
    return null;
};

export function BubbleActionButton(props: ActionButtonMessage) {
    const position = useBubblePosition(props.status);

    return (
        <View style={getButtonContainer(position)}>
            <TouchableOpacity
                testID={"chat_action_cell_default"}
                style={[
                    styles.common,
                    styles.button,
                    getButtonRadius(position),
                ]}
                onPress={props.onPress}
            >
                <Text style={[UITextStyle.primaryCaptionMedium, styles.text]}>
                    {props.text}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

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
    common: {
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: UIColor.primary(),
        marginVertical: UIConstant.tinyContentOffset(),
    },
    button: {
        // width: "100%",
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        height: UIConstant.smallButtonHeight(),
        borderRadius: UIConstant.borderRadius(),
    },
    buttonLeft: {
        borderTopLeftRadius: 0,
    },
    buttonRight: {
        borderBottomRightRadius: 0,
    },
    text: {
        color: UIColor.primary(),
    },
});
