import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIAssets } from '@tonlabs/uikit.assets';
import type { MaterialTextViewClearButtonProps } from '../types';
import { ImagePressableChild } from './ImagePressableChild';

export const MaterialTextViewClearButton = React.memo(function MaterialTextViewClearButton({
    clear,
    hiddenButton = false,
}: MaterialTextViewClearButtonProps) {
    if (hiddenButton) {
        return (
            <View style={styles.iconTapZone}>
                <View style={styles.iconSize} />
            </View>
        );
    }
    return (
        <Pressable testID="clear_btn" style={styles.iconTapZone} onPress={clear}>
            <ImagePressableChild source={UIAssets.icons.ui.clear} style={styles.iconSize} />
        </Pressable>
    );
});

const styles = StyleSheet.create({
    iconTapZone: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
