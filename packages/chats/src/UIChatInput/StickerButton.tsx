import * as React from 'react';
import {
    TouchableOpacity,
    Image, // TODO: use UIImage?
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { commonStyles } from './styles';

export type OnStickersPress = () => void | Promise<void>;

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
