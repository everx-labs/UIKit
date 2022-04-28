import * as React from 'react';
import { ColorValue, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';

import { TypographyVariants, makeStyles, UILabelAnimated } from '@tonlabs/uikit.themes';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { UIConstant } from '../constants';
import { ActionButtonIcon } from './ActionButtonIcon';
import type { UIActionButtonProps } from './types';
import { contentColors, UIActionButtonType } from './constants';
import { usePressableContentColor } from '../Pressable';

export function ActionButtonContent({
    icon,
    layout,
    loading,
    title,
    type = UIActionButtonType.Primary,
}: UIActionButtonProps) {
    const backgroundColor = usePressableContentColor(contentColors[type].background);
    const contentColor = usePressableContentColor(contentColors[type].content);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value as ColorValue,
        };
    });

    const animatedLabelProps = useAnimatedStyle(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    const styles = useStyles(icon, loading);

    return (
        <Animated.View style={[styles.container, layout, animatedStyles]}>
            <View style={styles.actionButtonIcon}>
                <ActionButtonIcon
                    icon={icon}
                    loading={loading}
                    color={contentColor}
                    indicatorColor={contentColors[type].content.initialColor}
                />
            </View>
            {title != null ? (
                <UILabelAnimated
                    animatedProps={animatedLabelProps}
                    style={styles.title}
                    role={TypographyVariants.NarrowActionNote}
                >
                    {title}
                </UILabelAnimated>
            ) : null}
        </Animated.View>
    );
}

const useStyles = makeStyles((icon: ImageSourcePropType | undefined, loading: boolean) => ({
    container: {
        height: UIConstant.actionButtonHeight,
        minWidth: UIConstant.actionButtonHeight,
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
        paddingHorizontal: UIConstant.normalContentOffset,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: null,
        }),
    },
    title: {
        paddingLeft: icon ? UIConstant.smallContentOffset : 0,
        opacity: loading && !icon ? 0 : 1,
    },
    actionButtonIcon: {
        /**
         * To avoid resizing the button when there is no icon.
         */
        ...(icon ? null : StyleSheet.absoluteFillObject),
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
