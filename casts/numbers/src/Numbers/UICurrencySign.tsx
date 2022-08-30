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
import { Typography, TypographyVariants, ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import {
    UICurrencySignIconAlign,
    UICurrencySignIconInlineHeight,
    UICurrencySignProps,
} from './types';
import { useInlineIconStyle, useBaselineDiff, useAssetSource } from './hooks';

function StaticCurrencyIcon({
    signVariant,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight,
    signIconAlign,
    integerVariant,
}: Required<Omit<UICurrencySignProps, 'signChar' | 'loading'>> & {
    integerVariant: TypographyVariants;
}) {
    const iconStyle = useInlineIconStyle(
        signVariant,
        signIconAspectRatio,
        signIconInlineHeight,
        signIconAlign,
        integerVariant,
    );
    /*
     * Space letter is important here, it's not a mistake!
     * It's placed to have a separation from main balance,
     * instead of `marginLeft` as space is more "text friendly"
     * and will layout properly in text
     */
    return (
        <Text style={[Typography[signVariant], styles.iconTextContainer]}>
            {'\u00A0'}
            <UIImage source={signIcon} resizeMode="contain" style={iconStyle} />
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
    signIconInlineHeight,
    signIconAlign,
    integerVariant,
}: Required<Omit<UICurrencySignProps, 'signChar'>> & {
    integerVariant: TypographyVariants;
}) {
    const loadingProgress = useSharedValue(LOADING_ANIMATION_STARTING_POINT);

    React.useEffect(() => {
        cancelAnimation(loadingProgress);
        if (loading) {
            loadingProgress.value = LOADING_ANIMATION_STARTING_POINT;
            loadingProgress.value = withRepeat(
                withTiming(LOADING_ANIMATION_ENDING_POINT, {
                    duration: 1000,
                }),
                // to run it forever
                // https://docs.swmansion.com/react-native-reanimated/docs/2.3.0-alpha.2/api/withRepeat#numberofreps-number-default-2
                -1,
            );
        } else {
            // If animation was in progress
            // we have to complete it, so that
            // it doesn't look like it's glitching
            loadingProgress.value = withTiming(LOADING_ANIMATION_ENDING_POINT, {
                duration: 1000 * (LOADING_ANIMATION_ENDING_POINT - loadingProgress.value),
            });
        }
    }, [loading, loadingProgress]);

    const iconStaticStyle = useInlineIconStyle(
        signVariant,
        signIconAspectRatio,
        signIconInlineHeight,
        signIconAlign,
        integerVariant,
    );

    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                ...(iconStaticStyle.transform ?? []),
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
        <>
            <Text
                style={[
                    Typography[signVariant],
                    styles.iconTextContainer,
                    {
                        height: 0,
                    },
                ]}
            >
                {'\u00A0'}
            </Text>
            <AnimatedUIImage
                source={signIcon}
                resizeMode="contain"
                style={[iconStaticStyle, iconAnimatedStyle]}
            />
        </>
    );
}

function TextSign({
    signChar,
    signVariant,
    integerColor,
    integerVariant,
}: Required<Pick<UICurrencySignProps, 'signChar' | 'signVariant'>> & {
    integerColor: ColorVariants;
    integerVariant: TypographyVariants;
}) {
    const theme = useTheme();
    const signWithIntegerBaselineDiff = useBaselineDiff(signVariant, integerVariant);
    return (
        <Text
            style={[
                Typography[signVariant],
                styles.iconTextContainer,
                {
                    color: theme[integerColor],
                    paddingBottom: -signWithIntegerBaselineDiff,
                },
            ]}
        >
            {'\u00A0'}
            {signChar}
        </Text>
    );
}

export const UICurrencySign = React.memo(function UICurrencySign({
    signChar,
    signVariant = TypographyVariants.SurfParagraphNormal,
    loading,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight = UICurrencySignIconInlineHeight.CapHeight,
    signIconAlign = UICurrencySignIconAlign.Middle,
    integerColor,
    integerVariant,
}: UICurrencySignProps & {
    integerColor: ColorVariants;
    integerVariant: TypographyVariants;
}) {
    const assetSource = useAssetSource(signIcon);

    if (signChar) {
        return (
            <TextSign
                signChar={signChar}
                signVariant={signVariant}
                integerColor={integerColor}
                integerVariant={integerVariant}
            />
        );
    }

    if (signIcon == null || assetSource == null) {
        return null;
    }

    if (loading == null) {
        return (
            <StaticCurrencyIcon
                key={assetSource.uri}
                signVariant={signVariant}
                signIcon={signIcon}
                signIconAspectRatio={signIconAspectRatio || assetSource.aspectRatio}
                signIconInlineHeight={signIconInlineHeight}
                signIconAlign={signIconAlign}
                integerVariant={integerVariant}
            />
        );
    }

    return (
        <AnimatedCurrencyIcon
            /**
             * The key is important here.
             *
             * On Android there was a bug, when changing an icon,
             * it was rendered with improper size
             * (with the one from previous render).
             * So here we force to re-mount it, to re-render completely.
             */
            key={assetSource.uri}
            loading={loading}
            signVariant={signVariant}
            signIcon={signIcon}
            signIconAspectRatio={signIconAspectRatio || assetSource.aspectRatio}
            signIconInlineHeight={signIconInlineHeight}
            signIconAlign={signIconAlign}
            integerVariant={integerVariant}
        />
    );
});

const styles = StyleSheet.create({
    iconTextContainer: {
        fontVariant: ['tabular-nums'],
    },
});
