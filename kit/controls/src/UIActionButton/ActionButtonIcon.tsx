import * as React from 'react';
import { ImageStyle, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';
import { UIIndicator } from '..';
import type { UIActionButtonIconProps } from './types';

function ActionButtonIconImpl({
    icon,
    loading,
    animStyles,
    initialColor,
}: UIActionButtonIconProps) {
    const theme = useTheme();
    const indicator = React.useMemo(() => {
        return (
            <View style={styles.icon}>
                <UIIndicator color={initialColor} size={UIConstant.actionButtonIconSize} />
            </View>
        );
    }, [initialColor]);

    if (loading) {
        return indicator;
    }
    if (icon) {
        return (
            <View>
                <Animated.Image
                    source={icon}
                    style={[
                        {
                            tintColor: theme[ColorVariants[initialColor as ColorVariants]],
                        },
                        styles.icon,
                    ]}
                />
                <Animated.Image
                    source={icon}
                    style={[
                        styles.icon,
                        styles.clone,
                        animStyles.hoverStyle as AnimatedStyleProp<ImageStyle>,
                    ]}
                />
                <Animated.Image
                    source={icon}
                    style={[
                        styles.icon,
                        styles.clone,
                        animStyles.pressStyle as AnimatedStyleProp<ImageStyle>,
                    ]}
                />
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    icon: {
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
    clone: {
        position: 'absolute',
    },
});

export const ActionButtonIcon = React.memo(ActionButtonIconImpl);
