import * as React from "react";
import { View, StyleSheet } from "react-native";

import { UIStyle } from "@uikit/core";
import { UILabel } from "@uikit/components";

import type { SystemMessage } from "./types";

export function BubbleSystem(props: SystemMessage) {
    return (
        <View style={styles.container}>
            <UILabel
                role={UILabel.Role.TinyRegular}
                text={props.text}
                style={UIStyle.color.textTertiary()}
                numberOfLines={1}
                ellipsizeMode="middle"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        justifyContent: "center",
    },
});
