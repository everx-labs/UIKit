import * as React from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    ImageSourcePropType,
    Image as RNImage,
    ImageResolvedAssetSource,
    View,
} from 'react-native';
import Animated, {
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import {
    Typography,
    TypographyVariants,
    ColorVariants,
    getFontMeasurements,
    useTheme,
    FontMeasurements,
} from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';

import { UICurrencySignIconAlign, UICurrencySignIconInlineHeight } from './types';
import type { UICurrencySignProps } from './types';
import { useBaselineDiff } from './useBaselineDiff';

function getBottomAlign(
    align: UICurrencySignIconAlign,
    fontMeasurements: FontMeasurements,
    integerMeasurement: FontMeasurements,
    signWithIntegerBaselineDiff: number,
    height: number,
) {
    const { baseline, descentBottom, middleline } = fontMeasurements;
    const {
        middleline: integerMiddleline,
        upperline: integerUpperline,
        lowerline: integerLowerline,
        baseline: integerBaseline,
    } = integerMeasurement;
    switch (align) {
        case UICurrencySignIconAlign.Baseline:
            return baseline - signWithIntegerBaselineDiff + descentBottom;
        case UICurrencySignIconAlign.Middle:
        default:
            // return integerMiddleline - height / 2;
            return integerBaseline;
    }
}

function useInlineIconStyle(
    variant: TypographyVariants,
    aspectRatio: number,
    inlineHeight: UICurrencySignIconInlineHeight,
    align: UICurrencySignIconAlign,
    integerVariant: TypographyVariants,
    signWithIntegerBaselineDiff: number,
) {
    return React.useMemo(() => {
        const measurements = getFontMeasurements(variant);
        const integerMeasurement = getFontMeasurements(integerVariant);

        if (measurements == null || integerMeasurement == null) {
            return {};
        }

        const { capHeight, lowerHeight, baseline, middleline, descentBottom } = measurements;
        const height =
            inlineHeight === UICurrencySignIconInlineHeight.LowerHeight ? lowerHeight : capHeight;
        // const bottomAlign = baseline - signWithIntegerBaselineDiff + descentBottom;

        const bottomAlign = getBottomAlign(
            align,
            measurements,
            integerMeasurement,
            signWithIntegerBaselineDiff,
            height,
        );

        // const {
        //     capHeight: integerCapHeight,
        //     lowerHeight: integerLowerHeight,
        //     baseline: integerBaseline,
        //     middleline: integerMiddleline,
        //     descentBottom: integerDescentBottom,
        //     lineHeight: integerLineHeight,
        // } = integerMeasurement;

        // if (inlineHeight === UICurrencySignIconInlineHeight.LowerHeight) {
        //     height = lowerHeight;
        // }

        // if (height == null) {
        //     return {};
        // }

        // let bottomAlign = 0;

        // if (align === UICurrencySignIconAlign.Middle) {
        //     let iconMiddle = 0.5 * height + baseline;
        //     // See below why I did it
        //     if (Platform.OS === 'ios') {
        //         iconMiddle -= descentBottom;
        //     }
        //     /**
        //      * Android for some reason also applies descentBottom to baseline
        //      */
        //     if (Platform.OS === 'android') {
        //         iconMiddle += descentBottom;
        //     }
        //     if (iconMiddle < middleline) {
        //         bottomAlign = middleline - iconMiddle;
        //     }
        // }

        // /**
        //  * Since iOS can't position icon properly on baseline
        //  * we do it manually.
        //  *
        //  * Important to notice here that iOS can't position image
        //  * to the bottom, it's actually has some aligment and it
        //  * looks like that it's height of descent (see Typography)
        //  * so we have to subtract it from baseline
        //  */
        // if (Platform.OS === 'ios' && align === UICurrencySignIconAlign.Baseline) {
        //     bottomAlign += baseline + descentBottom;
        // }

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
            borderWidth: 0.3,
        };
    }, [variant, integerVariant, align, signWithIntegerBaselineDiff, aspectRatio]);
}

function StaticCurrencyIcon({
    signVariant,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight,
    signIconAlign,
    integerVariant,
    signWithIntegerBaselineDiff,
}: Required<Omit<UICurrencySignProps, 'signChar' | 'loading'>> & {
    integerVariant: TypographyVariants;
    signWithIntegerBaselineDiff: number;
}) {
    const iconStyle = useInlineIconStyle(
        signVariant,
        signIconAspectRatio,
        signIconInlineHeight,
        signIconAlign,
        integerVariant,
        signWithIntegerBaselineDiff,
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
    signWithIntegerBaselineDiff,
}: Required<Omit<UICurrencySignProps, 'signChar'>> & {
    integerVariant: TypographyVariants;
    signWithIntegerBaselineDiff: number;
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
        signWithIntegerBaselineDiff,
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
    const theme = useTheme();
    const assetSource = React.useMemo(() => resolveAssetSource(signIcon), [signIcon]);
    const signWithIntegerBaselineDiff = useBaselineDiff(signVariant, integerVariant);

    if (signChar) {
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

    if (signIcon == null || assetSource == null) {
        return null;
    }

    if (loading == null) {
        return null;
        // return (
        //     <StaticCurrencyIcon
        //         key={assetSource.uri}
        //         signVariant={signVariant}
        //         signIcon={signIcon}
        //         signIconAspectRatio={signIconAspectRatio || assetSource.aspectRatio}
        //         signIconInlineHeight={signIconInlineHeight}
        //         signIconAlign={signIconAlign}
        //         integerVariant={integerVariant}
        //         signWithIntegerBaselineDiff={signWithIntegerBaselineDiff}
        //     />
        // );
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
            signWithIntegerBaselineDiff={signWithIntegerBaselineDiff}
        />
    );
});

const styles = StyleSheet.create({
    iconTextContainer: {
        // borderWidth: 0.3,
        fontVariant: ['tabular-nums'],
    },
});
