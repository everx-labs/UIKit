import * as React from 'react';
import {
    Image, // TODO: use UIImage?
    StyleSheet,
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '@tonlabs/uikit.core';
import { TouchableOpacity } from '@tonlabs/uikit.controls';

export type OnStickersPress = () => void | Promise<void>;

type Props = {
    editable: boolean;
    customKeyboardVisible: boolean;
    inputHasValue: boolean;
    onPress: OnStickersPress;
};

export function StickersButton(props: Props) {
    if (!props.editable || props.inputHasValue) {
        return null;
    }

    return (
        <TouchableOpacity
            testID="stickers_btn"
            style={styles.buttonContainer}
            onPress={() => props.onPress()}
        >
            <Image
                style={styles.icon}
                source={
                    !props.customKeyboardVisible
                        ? UIAssets.icons.ui.buttonStickerEnabled
                        : UIAssets.icons.ui.buttonStickerDisabled
                }
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.iconSize(),
        width: UIConstant.iconSize(),
    },
});
