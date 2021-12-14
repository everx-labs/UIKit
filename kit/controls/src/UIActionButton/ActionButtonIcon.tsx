import * as React from 'react';
import { ImageStyle, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';
import { UIIndicator } from '../UIIndicator';
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

    const tintColor = React.useMemo(
        () => theme[ColorVariants[initialColor as ColorVariants]],
        [theme, initialColor],
    );

    const iconMemoized = React.useMemo(() => {
        if (!icon) {
            return null;
        }
        return (
            <View>
                <Animated.Image
                    source={icon}
                    style={[
                        {
                            tintColor,
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
        /**
         * To prevent unnecessary re-renderings, we don't add `animStyles` to dependencies,
         * because `animStyles` is changed by mutation
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [icon, tintColor]);

    if (loading) {
        return indicator;
    }

    return iconMemoized;
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
