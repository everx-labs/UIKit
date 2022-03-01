import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIImage } from '@tonlabs/uikit.media';

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
            <UIImage
                style={styles.icon}
                source={UIAssets.icons.ui.buttonStickerEnabled}
                tintColor={
                    !props.customKeyboardVisible
                        ? ColorVariants.IconAccent
                        : ColorVariants.IconNeutral
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
