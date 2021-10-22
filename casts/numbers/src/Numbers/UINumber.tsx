import * as React from 'react';

import { TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';

import { UINumberDecimalAspect } from './localizedNumberFormat';
import type { UINumberProps } from './types';
import { UIAnimatedNumber } from './UIAnimatedNumber';
import { UIStaticNumber } from './UIStaticNumber';

/**
 * Component that renders numbers with proper formatting
 *
 * Implements https://www.notion.so/tonlabs/Numbers-formatting-e79034e889f74837b7acc822197a8b1a
 *
 * Please be aware that animated UINumber is wrapped with
 * <View /> element to properly support RTL,
 * therefore it might be not a good idea to put into <Text />
 */
export const UINumber = React.memo(function UINumber({
    testID,
    children,
    animated,
    decimalAspect = UINumberDecimalAspect.Short,
    integerVariant = TypographyVariants.ParagraphText,
    decimalVariant = TypographyVariants.ParagraphText,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextSecondary,
    showPositiveSign,
    showDebugGrid,
}: UINumberProps) {
    if (animated) {
        return (
            <UIAnimatedNumber
                testID={testID}
                decimalAspect={decimalAspect}
                integerVariant={integerVariant}
                integerColor={integerColor}
                decimalVariant={decimalVariant}
                decimalColor={decimalColor}
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
            showPositiveSign={showPositiveSign}
            showDebugGrid={showDebugGrid}
        >
            {children}
        </UIStaticNumber>
    );
});
