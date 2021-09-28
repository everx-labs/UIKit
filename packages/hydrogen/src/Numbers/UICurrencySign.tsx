import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import { Typography, TypographyVariants, getFontMesurements } from '../Typography';
import { UIImage } from '../UIImage';

import type { UICurrencySignProps } from './types';

function useInlineIconStyle(variant: TypographyVariants, aspectRatio: number) {
    return React.useMemo(() => {
        const { capHeight } = getFontMesurements(variant);

        if (capHeight == null) {
            return {};
        }

        return {
            // If use whole lineHeight it will not be
            // aligned with the baseline
            // There is a temp workaround to make it look better
            height: capHeight,
            width: capHeight * aspectRatio,
        };
    }, []);
}

function StaticCurrencyIcon({
    signVariant,
    signIcon,
    signIconAspectRatio,
}: Required<Omit<UICurrencySignProps, 'signChar' | 'loading'>>) {
    const iconStyle = useInlineIconStyle(signVariant, signIconAspectRatio);
    /*
     * Space letter here is important here, it's not a mistake!
     * It's placed to have a separation from main balance,
     * instead of `marginLeft` as space is more "text friendly"
     * and will layout properly in text
     */
    return (
        <Text style={[Typography[signVariant], styles.iconTextContainer]}>
            {'\u00A0'}
            <UIImage source={signIcon} resizeMode={'contain'} style={iconStyle} />
        </Text>
    );
}

const AnimatedUIImage = Animated.createAnimatedComponent(UIImage);

// @inline
const LOADING_ANIMATION_STARTING_POINT = 0;
// @inline
const LOADING_ANIMATION_ENDING_POINT = 1;

function AnimatedCurrencyIcon({
    loading,
    signVariant,
    signIcon,
    signIconAspectRatio,
}: Required<Omit<UICurrencySignProps, 'signChar'>>) {
    const loadingProgress = useSharedValue(LOADING_ANIMATION_STARTING_POINT);

    React.useEffect(() => {
        cancelAnimation(loadingProgress);
        loadingProgress.value = LOADING_ANIMATION_STARTING_POINT;
        if (loading) {
            loadingProgress.value = withRepeat(
                withTiming(LOADING_ANIMATION_ENDING_POINT, {
                    duration: 1000,
                }),
                // to run it forever
                // https://docs.swmansion.com/react-native-reanimated/docs/2.3.0-alpha.2/api/withRepeat#numberofreps-number-default-2
                -1,
            );
        }
    }, [loading]);

    const iconStaticStyle = useInlineIconStyle(signVariant, signIconAspectRatio);

    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateY: `${interpolate(
                        loadingProgress.value,
                        [LOADING_ANIMATION_STARTING_POINT, LOADING_ANIMATION_ENDING_POINT],
                        [0, 360],
                    )}deg`,
                },
            ],
        };
    });
    /*
     * Space letter here is important here, it's not a mistake!
     * It's placed to have a separation from main balance,
     * instead of `marginLeft` as space is more "text friendly"
     * and will layout properly in text
     */
    return (
        <Text style={[Typography[signVariant], styles.iconTextInputContainer]}>
            {'\u00A0'}
            <AnimatedUIImage
                source={signIcon}
                // resizeMode={'contain'}
                style={[iconStaticStyle, iconAnimatedStyle]}
            />
        </Text>
    );
}

export function UICurrencySign({
    signChar,
    signVariant,
    loading,
    signIcon,
    signIconAspectRatio = 1,
}: UICurrencySignProps) {
    if (signChar) {
        return (
            <Text style={[Typography[signVariant]]}>
                {'\u00A0'}
                {signChar}
            </Text>
        );
    }

    if (signIcon == null) {
        return null;
    }

    if (loading == null) {
        return (
            <StaticCurrencyIcon
                signVariant={signVariant}
                signIcon={signIcon}
                signIconAspectRatio={signIconAspectRatio}
            />
        );
    }

    return (
        <AnimatedCurrencyIcon
            loading={loading}
            signVariant={signVariant}
            signIcon={signIcon}
            signIconAspectRatio={signIconAspectRatio}
        />
    );
}

const styles = StyleSheet.create({
    iconTextInputContainer: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    iconTextContainer: {
        fontVariant: ['tabular-nums'],
    },
});
