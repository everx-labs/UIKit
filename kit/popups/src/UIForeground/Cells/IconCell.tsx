import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import type { UIForegroundIconProps } from '../types';
import { ColumnStatusContext } from '../Container';
import { usePressableCellColorByColumnStatus, useMergedColumnStatus } from '../hooks';
import { TouchableWrapper } from '../TouchableWrapper';

export function IconCell({
    source,
    onPress,
    disabled,
    negative,
    tintColor: tintColorProp,
}: UIForegroundIconProps) {
    const columnStatus = React.useContext(ColumnStatusContext);
    const mergedColumnStatus = useMergedColumnStatus(columnStatus, disabled, negative, onPress);
    const tintColor = usePressableCellColorByColumnStatus(mergedColumnStatus);
    if (!source) {
        return null;
    }
    return (
        <TouchableWrapper
            disabled={columnStatus.columnState === 'Pressable' || disabled}
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
        paddingHorizontal: UILayoutConstant.normalContentOffset / 2,
    },
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
