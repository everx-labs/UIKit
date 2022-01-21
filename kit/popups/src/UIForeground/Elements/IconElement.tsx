import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import type { UIForegroundIconProps } from '../types';
import { PartStatusContext } from '../Container';
import { usePressableElementColorByPartStatus, useMergedPartStatus } from '../hooks';
import { TouchableWrapper } from '../TouchableWrapper';

export function IconElement({
    source,
    onPress,
    disabled,
    negative,
    tintColor: tintColorProp,
}: UIForegroundIconProps) {
    const partStatus = React.useContext(PartStatusContext);
    const mergedPartStatus = useMergedPartStatus(partStatus, disabled, negative, onPress);
    const tintColor = usePressableElementColorByPartStatus(mergedPartStatus);
    if (!source) {
        return null;
    }
    return (
        <TouchableWrapper
            disabled={partStatus.partState === 'Pressable' || disabled}
            onPress={onPress}
            style={styles.container}
        >
            <UIImage source={source} tintColor={tintColorProp || tintColor} style={styles.image} />
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.contentInsetVerticalX3 / 2,
    },
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
