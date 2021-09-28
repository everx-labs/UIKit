import * as React from 'react';
import { View } from 'react-native';

import { TypographyVariants } from '../Typography';
import { ColorVariants } from '../Colors';
import type { UICurrencyProps } from './types';
import { UINumberDecimalAspect } from './runOnUILocalizedNumberFormat';
import { UIAnimatedNumber } from './UIAnimatedNumber';
import { UICurrencySign } from './UICurrencySign';
import { UIStaticNumber } from './UIStaticNumber';
import { useTextLikeContainer } from './useTextLikeContainer';

/**
 * Extended version of UINumber that contain a sign or icon.
 */
export function UICurrency({
    testID,
    value,
    animated,
    decimalAspect = UINumberDecimalAspect.Short,
    integerVariant = TypographyVariants.ParagraphText,
    decimalVariant = TypographyVariants.ParagraphText,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextSecondary,
    signChar,
    signVariant,
    signIcon,
    signIconAspectRatio,
    loading,
}: UICurrencyProps) {
    const textLikeContainer = useTextLikeContainer();

    if (animated) {
        return (
            <View style={textLikeContainer} testID={testID}>
                <UIAnimatedNumber
                    decimalAspect={decimalAspect}
                    integerVariant={integerVariant}
                    integerColor={integerColor}
                    decimalVariant={decimalVariant}
                    decimalColor={decimalColor}
                    value={value}
                />
                <UICurrencySign
                    loading={loading}
                    signChar={signChar}
                    signVariant={signVariant || decimalVariant}
                    signIcon={signIcon}
                    signIconAspectRatio={signIconAspectRatio}
                />
            </View>
        );
    }

    return (
        <View style={textLikeContainer} testID={testID}>
            <UIStaticNumber
                decimalAspect={decimalAspect}
                integerVariant={integerVariant}
                integerColor={integerColor}
                decimalVariant={decimalVariant}
                decimalColor={decimalColor}
                value={value}
            />
            <UICurrencySign
                loading={false}
                signChar={signChar}
                signVariant={signVariant || decimalVariant}
                signIcon={signIcon}
                signIconAspectRatio={signIconAspectRatio}
            />
        </View>
    );
}
