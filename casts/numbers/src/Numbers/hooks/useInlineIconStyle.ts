import * as React from 'react';
import { FontMeasurements, TypographyVariants, getFontMeasurements } from '@tonlabs/uikit.themes';
import { UICurrencySignIconAlign, UICurrencySignIconInlineHeight } from '../types';

function getBottomAlign(
    align: UICurrencySignIconAlign,
    integerMeasurements: FontMeasurements,
    height: number,
) {
    const { baseline: integerBaseline, capHeight: integerCapHeight } = integerMeasurements;
    switch (align) {
        case UICurrencySignIconAlign.Baseline:
            return integerBaseline;
        case UICurrencySignIconAlign.Middle:
        default:
            return integerBaseline + (integerCapHeight - height) / 2;
    }
}

export function useInlineIconStyle(
    variant: TypographyVariants,
    aspectRatio: number,
    inlineHeight: UICurrencySignIconInlineHeight,
    align: UICurrencySignIconAlign,
    integerVariant: TypographyVariants,
) {
    return React.useMemo(() => {
        const measurements = getFontMeasurements(variant);
        const integerMeasurement = getFontMeasurements(integerVariant);

        if (measurements == null || integerMeasurement == null) {
            return {};
        }

        const { capHeight, lowerHeight } = measurements;
        const height =
            inlineHeight === UICurrencySignIconInlineHeight.LowerHeight ? lowerHeight : capHeight;

        const bottomAlign = getBottomAlign(align, integerMeasurement, height);

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
    }, [variant, integerVariant, inlineHeight, align, aspectRatio]);
}
