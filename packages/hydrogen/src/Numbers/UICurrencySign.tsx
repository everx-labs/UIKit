import * as React from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    ImageSourcePropType,
    Image as RNImage,
    ImageResolvedAssetSource,
} from 'react-native';
import Animated, {
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import { UICurrencySignIconAlign, UICurrencySignIconInlineHeight } from './types';
import type { UICurrencySignProps } from './types';

import { Typography, TypographyVariants, getFontMesurements } from '../Typography';
import { UIImage } from '../UIImage';

function useInlineIconStyle(
    variant: TypographyVariants,
    aspectRatio: number,
    inlineHeight: UICurrencySignIconInlineHeight,
    align: UICurrencySignIconAlign,
) {
    return React.useMemo(() => {
        const measurement = getFontMesurements(variant);

        if (measurement == null) {
            return {};
        }

        const { capHeight, lowerHeight, baseline, middleline, descentBottom } = measurement;

        let height = capHeight;

        if (inlineHeight === UICurrencySignIconInlineHeight.LowerHeight) {
            height = lowerHeight;
        }

        if (height == null) {
            return {};
        }

        let bottomAlign = 0;

        if (align === UICurrencySignIconAlign.Middle) {
            let iconMiddle = 0.5 * height + baseline;
            // See below why I did it
            if (Platform.OS === 'ios') {
                iconMiddle -= descentBottom;
            }
            /**
             * Android for some reason also applies descentBottom to baseline
             */
            if (Platform.OS === 'android') {
                iconMiddle += descentBottom;
            }
            if (iconMiddle < middleline) {
                bottomAlign = middleline - iconMiddle;
            }
        }

        /**
         * Since iOS can't position icon properly on baseline
         * we do it manually.
         *
         * Important to notice here that iOS can't position image
         * to the bottom, it's actually has some aligment and it
         * looks like that it's height of descent (see Typography)
         * so we have to subtract it from baseline
         */
        if (Platform.OS === 'ios' && align === UICurrencySignIconAlign.Baseline) {
            bottomAlign = baseline - descentBottom;
        }

        return {
            // If use whole lineHeight it will not be
            // aligned with the baseline
            // There is a temp workaround to make it look better
            height: Math.round(height),
            width: Math.round(height * aspectRatio),
            transform: [
                {
                    translateY: -bottomAlign,
                },
            ],
        };
    }, [variant, aspectRatio, align, inlineHeight]);
}

function StaticCurrencyIcon({
    signVariant,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight,
    signIconAlign,
}: Required<Omit<UICurrencySignProps, 'signChar' | 'loading'>>) {
    const iconStyle = useInlineIconStyle(
        signVariant,
        signIconAspectRatio,
        signIconInlineHeight,
        signIconAlign,
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
}: Required<Omit<UICurrencySignProps, 'signChar'>>) {
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
        <Text style={[Typography[signVariant], styles.iconTextContainer]}>
            {'\u00A0'}
            <AnimatedUIImage
                source={signIcon}
                resizeMode="contain"
                style={[iconStaticStyle, iconAnimatedStyle]}
            />
        </Text>
    );
}

function resolveAssetSource(
    signIcon?: ImageSourcePropType,
): (ImageResolvedAssetSource & { aspectRatio: number }) | null {
    if (signIcon == null) {
        return null;
    }

    // For web we are to `resolveAssetsSource` manually until `react-native-web` supports it
    // Check out the following PR: https://github.com/necolas/react-native-web/pull/2144
    // @ts-ignore (Working with AdaptiveImage instance)
    const { width, height, uri, data } = signIcon ?? {};
    if (width != null && width > 0 && height != null && height > 0) {
        // Find the asset scale
        let scale = 1.0;
        if (data != null && uri != null) {
            if (data['uri@2x'] === uri) {
                scale = 2.0;
            } else if (data['uri@3x'] === uri) {
                scale = 3.0;
            }
        }
        // Return the ImageResolvedAssetSource & { aspectRatio: number } instance
        return {
            width,
            height,
            aspectRatio: (1.0 * width) / height,
            scale,
            uri,
        };
    }

    const source = RNImage.resolveAssetSource(signIcon);
    let aspectRatio = 1;

    if (source.height > 0 && source.width > 0) {
        aspectRatio = source.width / source.height;
    }

    return {
        ...source,
        aspectRatio,
    };
}

export const UICurrencySign = React.memo(function UICurrencySign({
    signChar,
    signVariant,
    loading,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight = UICurrencySignIconInlineHeight.CapHeight,
    signIconAlign = UICurrencySignIconAlign.Middle,
}: UICurrencySignProps) {
    const assetSource = React.useMemo(() => resolveAssetSource(signIcon), [signIcon]);

    if (signChar) {
        return (
            <Text style={[Typography[signVariant], styles.iconTextContainer]}>
                {'\u00A0'}
                {signChar}
            </Text>
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
        />
    );
});

const styles = StyleSheet.create({
    iconTextContainer: {
        fontVariant: ['tabular-nums'],
    },
});
