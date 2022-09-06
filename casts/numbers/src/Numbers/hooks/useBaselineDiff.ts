import * as React from 'react';
import { TypographyVariants, getFontMeasurements } from '@tonlabs/uikit.themes';

export function useBaselineDiff(
    firstVariant: TypographyVariants,
    secondVariant: TypographyVariants,
): number {
    return React.useMemo(() => {
        const decimalBaseline = getFontMeasurements(firstVariant)?.baseline ?? 0;
        const integerBaseline = getFontMeasurements(secondVariant)?.baseline ?? 0;
        return decimalBaseline - integerBaseline;
    }, [firstVariant, secondVariant]);
}
