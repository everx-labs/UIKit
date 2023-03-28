import * as React from 'react';

import { TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';
import type { UICurrencyProps } from './types';
import { UINumberDecimalAspect } from './localizedNumberFormat';
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
    integerVariant = TypographyVariants.SurfParagraphLarge,
    decimalVariant = TypographyVariants.SurfParagraphNormal,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextSecondary,
    signChar,
    signCharBeforeNumber = false,
    signVariant,
    signIcon,
    signIconAspectRatio,
    signIconInlineHeight,
    signIconAlign,
    loading,
    showPositiveSign,
    showDebugGrid,
}: UICurrencyProps & { signCharBeforeNumber?: boolean }) {
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
                        integerColor={integerColor}
                        integerVariant={integerVariant}
                        signChar={signChar}
                        signVariant={signVariant || decimalVariant}
                        signIcon={signIcon}
                        signIconAspectRatio={signIconAspectRatio}
                        signIconInlineHeight={signIconInlineHeight}
                        signIconAlign={signIconAlign}
                    />
                }
                signBeforeNumber={signCharBeforeNumber}
                showPositiveSign={showPositiveSign}
                showDebugGrid={showDebugGrid}
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
                    integerColor={integerColor}
                    integerVariant={integerVariant}
                    signChar={signChar}
                    signVariant={signVariant || decimalVariant}
                    signIcon={signIcon}
                    signIconAspectRatio={signIconAspectRatio}
                    signIconInlineHeight={signIconInlineHeight}
                    signIconAlign={signIconAlign}
                />
            }
            signBeforeNumber={signCharBeforeNumber}
            showPositiveSign={showPositiveSign}
            showDebugGrid={showDebugGrid}
        >
            {children}
        </UIStaticNumber>
    );
});
