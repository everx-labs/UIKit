import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';

export type OnStickersPress = () => void | Promise<void>;

type Props = {
    editable: boolean;
    customKeyboardVisible: boolean;
    inputHasValue: boolean;
    onPress: OnStickersPress;
};

export function StickersButton({ editable, inputHasValue, customKeyboardVisible, onPress }: Props) {
    if (!editable || inputHasValue) {
        return null;
    }

    return (
        <TouchableOpacity
            testID="stickers_btn"
            style={styles.buttonContainer}
            onPress={() => onPress()}
        >
            <UIImage
                style={styles.icon}
                source={UIAssets.icons.ui.buttonStickerEnabled}
                tintColor={
                    !customKeyboardVisible
                        ? ColorVariants.BackgroundAccent
                        : ColorVariants.IconNeutral
                }
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UILayoutConstant.largeButtonHeight,
    },
    icon: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
