import * as React from 'react';
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { commonStyles } from './styles';

type OnPress = (show: boolean) => void | Promise<void>;
type Props = {
    hasStickers: boolean;
    stickersActive: boolean;
    inputHasValue: boolean;
    onPress: OnPress;
};

export function StickerButton(props: Props) {
    if (!props.hasStickers) {
        return null;
    }

    React.useEffect(
        (inputHasValue: boolean, onPress: OnPress) => {
            if (inputHasValue) {
                // To hide keyboard
                onPress(false);
            }
        },
        [props.inputHasValue, props.onPress]
    );

    return (
        <TouchableOpacity
            testID="stickers_btn"
            style={commonStyles.buttonContainer}
            onPress={() => props.onPress(!props.stickersActive)}
        >
            <Image
                style={commonStyles.icon}
                source={
                    !props.stickersActive
                        ? UIAssets.icons.ui.buttonStickerEnabled
                        : UIAssets.icons.ui.buttonStickerDisabled
                }
            />
        </TouchableOpacity>
    );
}
