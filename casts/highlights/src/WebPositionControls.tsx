import * as React from 'react';
import { ColorValue, I18nManager, ImageSourcePropType, Platform, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';

import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { Pressable, PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UIHighlightsConstants } from './constants';

import leftImageSource from './assets/left.png';
import rightImageSource from './assets/right.png';

const controlColors: PressableColors = {
    initialColor: ColorVariants.GraphTertiary,
    pressedColor: ColorVariants.GraphSecondary,
    hoveredColor: ColorVariants.GraphPrimary,
    disabledColor: ColorVariants.GraphTertiary,
    loadingColor: ColorVariants.GraphTertiary,
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
    calculateClosestPreviousX,
    calculateClosestNextX,
}: {
    scrollRef: React.RefObject<Animated.ScrollView>;
    currentGravityPosition: SharedValue<number>;
    calculateClosestPreviousX: (position: number) => number;
    calculateClosestNextX: (position: number) => number;
}) {
    if (Platform.OS !== 'web') {
        return null;
    }

    const isRtl = I18nManager.getConstants().isRTL;

    return (
        <UIBackgroundView color={ColorVariants.BackgroundBW} style={styles.container}>
            <Pressable
                testID="web-position-control-previus-button"
                style={styles.control}
                onPress={() => {
                    const closestX = calculateClosestPreviousX(currentGravityPosition.value);
                    scrollRef.current?.scrollTo({ x: closestX, animated: true });
                }}
            >
                <ControlContent>{isRtl ? rightImageSource : leftImageSource}</ControlContent>
            </Pressable>
            <Pressable
                testID="web-position-control-next-button"
                style={styles.control}
                onPress={() => {
                    const closestX = calculateClosestNextX(currentGravityPosition.value);
                    scrollRef.current?.scrollTo({ x: closestX, animated: true });
                }}
            >
                <ControlContent>{isRtl ? leftImageSource : rightImageSource}</ControlContent>
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
        userSelect: 'none',
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
