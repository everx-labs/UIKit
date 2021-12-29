import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UIConstant } from '../constants';
import { UIIndicator } from '../UIIndicator';
import type { UIActionButtonIconProps } from './types';

function ActionButtonIconImpl({
    icon,
    loading,
    animatedProps,
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
                <UIAnimatedImage
                    source={icon}
                    animatedProps={animatedProps}
                    style={styles.iconSize}
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
            {loading ? (
                <View style={styles.indicator}>
                    <UIIndicator color={initialColor} size={UIConstant.actionButtonIconSize} />
                </View>
            ) : (
                iconMemoized
            )}
        </View>
    );
}

const useStyles = makeStyles(() => ({
    iconSize: {
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
    clone: {
        position: 'absolute',
    },
    indicator: {
        ...StyleSheet.absoluteFillObject,
    },
}));

export const ActionButtonIcon = React.memo(ActionButtonIconImpl);
