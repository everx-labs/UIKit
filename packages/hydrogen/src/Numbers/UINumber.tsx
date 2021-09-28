import * as React from 'react';
import { View } from 'react-native';

import { TypographyVariants } from '../Typography';
import { ColorVariants } from '../Colors';

import { UINumberDecimalAspect } from './runOnUILocalizedNumberFormat';
import type { UINumberProps } from './types';
import { UIAnimatedNumber } from './UIAnimatedNumber';
import { UIStaticNumber } from './UIStaticNumber';
import { useTextLikeContainer } from './useTextLikeContainer';

/**
 * Component that renders numbers with proper formatting
 *
 * Implements https://www.notion.so/tonlabs/Numbers-formatting-e79034e889f74837b7acc822197a8b1a
 *
 * Please be aware that UINumber is wrapped with
 * <View /> element to properly support RTL,
 * therefore it might be not a good idea to put into <Text />
 */
export function UINumber({
    testID,
    animated,
    decimalAspect = UINumberDecimalAspect.Short,
    integerVariant = TypographyVariants.ParagraphText,
    decimalVariant = TypographyVariants.ParagraphText,
    integerColor = ColorVariants.TextPrimary,
    decimalColor = ColorVariants.TextSecondary,
    ...rest
}: UINumberProps) {
    // TODO: set accessibilityLabel!
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
                    {...rest}
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
                {...rest}
            />
        </View>
    );
}
