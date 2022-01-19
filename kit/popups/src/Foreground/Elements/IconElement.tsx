import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import type { UIForegroundIconProps } from '../types';
import { PartStatusContext } from '../Container';
import { useColorByPartStatus, useMergedPartStatus } from '../hooks';

export function IconElement({ source, onPress, disabled, negative }: UIForegroundIconProps) {
    const partStatus = React.useContext(PartStatusContext);
    const mergedPartStatus = useMergedPartStatus(partStatus, disabled, negative, onPress);
    const tintColor = useColorByPartStatus(mergedPartStatus);
    if (!source) {
        return null;
    }
    return (
        <TouchableOpacity
            disabled={partStatus.partState === 'Pressable' || !onPress || disabled}
            onPress={onPress}
            style={styles.container}
        >
            <UIImage source={source} tintColor={tintColor} style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.contentInsetVerticalX3,
    },
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
