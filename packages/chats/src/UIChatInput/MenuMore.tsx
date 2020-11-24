import * as React from "react";
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
    View,
} from "react-native";

import { UIAssets } from "@tonlabs/uikit.assets";

import { commonStyles } from "./styles";
import type { MenuItem } from "./types";

type Props = {
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
};

const { buttonDots } = UIAssets.icons.ui;

export function MenuMore({ menuMore, menuMoreDisabled }: Props) {
    if (!menuMore || menuMore.length === 0) {
        return null;
    }

    let content = null;

    if (menuMoreDisabled) {
        content = <Image source={buttonDots} />;
    } else if (menuMore.length === 1) {
        content = (
            <TouchableOpacity onPress={menuMore[0].onPress}>
                <Image source={buttonDots} />
            </TouchableOpacity>
        );
    } else {
        content = (
            <UIPopoverMenu
                testID="menu_view"
                menuItemsList={menuMore}
                placement="top"
            >
                <Image source={buttonDots} />
            </UIPopoverMenu>
        );
    }

    return (
        <View style={commonStyles.buttonContainer}>
            <View style={commonStyles.icon}>{content}</View>
        </View>
    );
}
