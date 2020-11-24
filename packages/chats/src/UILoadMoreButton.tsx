import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { MaterialIndicator } from "react-native-indicators";

import { UIColor, UIConstant, UIStyle } from "@tonlabs/uikit.core";
import { UILabel, UIComponent } from "@tonlabs/uikit.components";

type Props = {
    label?: string;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<ViewStyle>;
};

const Indicator = ({ isLoadingMore }: { isLoadingMore: boolean }) => {
    if (!isLoadingMore) {
        return null;
    }
    return (
        <MaterialIndicator
            style={styles.indicator}
            color={UIColor.white()}
            size={20}
        />
    );
};

export const UILoadMoreButton = (props: Props) => (
    <TouchableOpacity
        style={[styles.container, props.containerStyle]}
        onPress={() => {
            if (props.onLoadMore) {
                props.onLoadMore();
            }
        }}
        disabled={props.isLoadingMore}
    >
        <View style={[styles.wrapper, props.wrapperStyle]}>
            {props.label && (
                <UILabel
                    role={UILabel.Role.TinyRegular}
                    style={[
                        UIStyle.color.getColorStyle(UIColor.textTertiary()),
                        props.textStyle,
                        { opacity: props.isLoadingMore ? 0 : 1 },
                    ]}
                    text={props.label}
                />
            )}
            <Indicator isLoadingMore={props.isLoadingMore} />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        paddingVertical: UIConstant.contentOffset(),
    },
    wrapper: {
        flexShrink: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        borderRadius: UIConstant.smallCellHeight() / 2,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    indicator: {
        position: "absolute",
        alignSelf: "center",
    },
});
