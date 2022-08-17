/* eslint-disable global-require */
import * as React from 'react';
import { ColorValue, ImageSourcePropType, Platform, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';

import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { Pressable, PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UIHighlightsConstants } from './constants';

const controlColors: PressableColors = {
    initialColor: ColorVariants.GraphTertiary,
    pressedColor: ColorVariants.GraphSecondary,
    hoveredColor: ColorVariants.GraphPrimary,
    disabledColor: ColorVariants.GraphNeutral,
    loadingColor: ColorVariants.GraphNeutral,
};

function ControlContent({ children }: { children: ImageSourcePropType }) {
    const color = usePressableContentColor(controlColors);

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: color.value as ColorValue,
        };
    });

    return (
        <UIAnimatedImage source={children} style={styles.icon} animatedProps={animatedImageProps} />
    );
}

export function WebPositionControl({
    scrollRef,
    currentGravityPosition,
    calculateClosestLeftX,
    calculateClosestRightX,
}: {
    scrollRef: React.RefObject<Animated.ScrollView>;
    currentGravityPosition: SharedValue<number>;
    calculateClosestLeftX: (position: number) => number;
    calculateClosestRightX: (position: number) => number;
}) {
    if (Platform.OS !== 'web') {
        return null;
    }

    return (
        <UIBackgroundView color={ColorVariants.BackgroundBW} style={styles.container}>
            <Pressable
                style={styles.control}
                onPress={() => {
                    const closestX = calculateClosestLeftX(currentGravityPosition.value);
                    scrollRef.current?.scrollTo({ x: closestX, animated: true });
                }}
            >
                <ControlContent>{require('./assets/left.png')}</ControlContent>
            </Pressable>
            <Pressable
                style={styles.control}
                onPress={() => {
                    const closestX = calculateClosestRightX(currentGravityPosition.value);
                    scrollRef.current?.scrollTo({ x: closestX, animated: true });
                }}
            >
                <ControlContent>{require('./assets/right.png')}</ControlContent>
            </Pressable>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        flexDirection: 'row',
        height: UIHighlightsConstants.controlItemHeight,
        paddingHorizontal: UIHighlightsConstants.controlsHorizontalOffset,
        borderRadius: UIHighlightsConstants.controlItemHeight / 2,
    },
    control: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: UIHighlightsConstants.controlIconSize,
        height: UIHighlightsConstants.controlIconSize,
    },
});
