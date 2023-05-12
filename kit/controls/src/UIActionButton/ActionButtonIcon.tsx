import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UIConstant } from '../constants';
import { UIIndicator } from '../UIIndicator';
import type { ActionButtonIconProps } from './types';
import { usePressableAnimatedImageTintColorProps } from '../Pressable';

function ActionButtonIconImpl(props: ActionButtonIconProps) {
    const { icon, loading, color, indicatorColor } = props;
    const animatedImageProps = usePressableAnimatedImageTintColorProps(color);

    if (loading) {
        return (
            <UIIndicator
                color={indicatorColor}
                size={UIConstant.actionButtonIconSize}
                style={styles.iconSize}
            />
        );
    }

    if (!icon) {
        return null;
    }

    return <UIAnimatedImage source={icon} {...animatedImageProps} style={styles.iconSize} />;
}

const styles = StyleSheet.create({
    iconSize: {
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
});

export const ActionButtonIcon = React.memo(ActionButtonIconImpl);
