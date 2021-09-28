import * as React from 'react';

import { TypographyVariants } from '../Typography';
import { ColorVariants } from '../Colors';
import type { UICurrencyProps } from './types';
import { UINumberDecimalAspect } from './runOnUILocalizedNumberFormat';
import { UIAnimatedNumber } from './UIAnimatedNumber';
import { UICurrencySign } from './UICurrencySign';
import { UIStaticNumber } from './UIStaticNumber';

/**
 * Extended version of UINumber that contain a sign or icon.
 */
export const UICurrency = React.memo(function UICurrency({
    testID,
    children,
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
    if (animated) {
        return (
            <UIAnimatedNumber
                testID={testID}
                decimalAspect={decimalAspect}
                integerVariant={integerVariant}
                integerColor={integerColor}
                decimalVariant={decimalVariant}
                decimalColor={decimalColor}
                sign={
                    <UICurrencySign
                        loading={loading}
                        signChar={signChar}
                        signVariant={signVariant || decimalVariant}
                        signIcon={signIcon}
                        signIconAspectRatio={signIconAspectRatio}
                    />
                }
            >
                {children}
            </UIAnimatedNumber>
        );
    }

    return (
        <UIStaticNumber
            testID={testID}
            decimalAspect={decimalAspect}
            integerVariant={integerVariant}
            integerColor={integerColor}
            decimalVariant={decimalVariant}
            decimalColor={decimalColor}
            sign={
                <UICurrencySign
                    loading={false}
                    signChar={signChar}
                    signVariant={signVariant || decimalVariant}
                    signIcon={signIcon}
                    signIconAspectRatio={signIconAspectRatio}
                />
            }
        >
            {children}
        </UIStaticNumber>
    );
});
