import * as React from 'react';
import { ImageStyle, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
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

    const styles = useStyles(loading);

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
                        styles.iconSize as AnimatedStyleProp<ImageStyle>,
                    ]}
                />
                <Animated.Image
                    source={icon}
                    style={[
                        styles.iconSize as AnimatedStyleProp<ImageStyle>,
                        styles.clone as AnimatedStyleProp<ImageStyle>,
                        animStyles.hoverStyle as AnimatedStyleProp<ImageStyle>,
                    ]}
                />
                <Animated.Image
                    source={icon}
                    style={[
                        styles.iconSize as AnimatedStyleProp<ImageStyle>,
                        styles.clone as AnimatedStyleProp<ImageStyle>,
                        animStyles.pressStyle as AnimatedStyleProp<ImageStyle>,
                    ]}
                />
            </View>
        );
        /**
         * To prevent unnecessary re-renderings, we don't add `animStyles` and `styles` to dependencies,
         * because `animStyles` is changed by mutation
         * and `styles` isn't changed at all
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [icon, tintColor]);

    return (
        <View style={styles.iconSize}>
            <View style={styles.indicator}>
                <UIIndicator color={initialColor} size={UIConstant.actionButtonIconSize} />
            </View>
            <View style={styles.icon}>{iconMemoized}</View>
        </View>
    );
}

const useStyles = makeStyles((loading: boolean) => ({
    icon: {
        opacity: loading ? 0 : 1,
    },
    iconSize: {
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
    clone: {
        position: 'absolute',
    },
    indicator: {
        ...StyleSheet.absoluteFillObject,
        opacity: loading ? 1 : 0,
    },
}));

export const ActionButtonIcon = React.memo(ActionButtonIconImpl);
