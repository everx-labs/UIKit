import * as React from "react";
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
} from "react-native";

import stickerEnabled from "@tonlabs/uikit.assets/btn_sticker_enabled/stickerEnabled.png";
import stickerDisabled from "@tonlabs/uikit.assets/btn_sticker_disabled/stickerDisabled.png";

import { commonStyles } from "./styles";

type Props = {
    hasStickers: boolean;
    stickersActive: boolean;
    value?: string;
    onPress: (show: boolean) => void | Promise<void>;
};

export function StickerButton(props: Props) {
    if (!props.hasStickers) {
        return null;
    }

    if (props.value && props.value.length > 0) {
        // TODO: this should be removed out of render!
        // To hide keyboard
        this.onPress(false);
        return null;
    }

    return (
        <TouchableOpacity
            style={commonStyles.buttonContainer}
            testID="stickers_btn"
            onPress={() => this.onPress(!props.stickersActive)}
        >
            <Image
                style={commonStyles.icon}
                source={
                    !props.stickersActive ? stickerEnabled : stickerDisabled
                }
            />
        </TouchableOpacity>
    );
}
