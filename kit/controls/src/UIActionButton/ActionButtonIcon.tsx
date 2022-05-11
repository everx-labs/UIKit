import * as React from 'react';
import { ColorValue, StyleSheet } from 'react-native';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { useAnimatedProps } from 'react-native-reanimated';
import { UIConstant } from '../constants';
import { UIIndicator } from '../UIIndicator';
import type { ActionButtonIconProps } from './types';

function ActionButtonIconImpl(props: ActionButtonIconProps) {
    const { icon, loading, color, indicatorColor } = props;
    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: color?.value as ColorValue,
        };
    });

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

    return (
        <UIAnimatedImage source={icon} animatedProps={animatedImageProps} style={styles.iconSize} />
    );
}

const styles = StyleSheet.create({
    iconSize: {
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
});

export const ActionButtonIcon = React.memo(ActionButtonIconImpl);
