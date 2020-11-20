import * as React from 'react';
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { commonStyles } from './styles';

export type OnStickersPress = (show?: boolean) => void | Promise<void>;
type Props = {
    hasStickers: boolean;
    stickersVisible: boolean;
    inputHasValue: boolean;
    onPress: OnStickersPress;
};

export function StickersButton(props: Props) {
    if (!props.hasStickers) {
        return null;
    }

    React.useEffect(
        () => {
            if (props.inputHasValue) {
                // To hide keyboard
                props.onPress(false);
            }
        },
        [props.inputHasValue, props.onPress]
    );

    return (
        <TouchableOpacity
            testID="stickers_btn"
            style={commonStyles.buttonContainer}
            onPress={() => props.onPress()}
        >
            <Image
                style={commonStyles.icon}
                source={
                    !props.stickersVisible
                        ? UIAssets.icons.ui.buttonStickerEnabled
                        : UIAssets.icons.ui.buttonStickerDisabled
                }
            />
        </TouchableOpacity>
    );
}
