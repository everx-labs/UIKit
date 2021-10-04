import * as React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { Typography } from '../Typography';
import { useTheme, ColorVariants } from '../Colors';

import { useNumberValue } from './useNumberValue';
import {
    runOnUILocalizedNumberFormat,
    UINumberDecimalAspect,
} from './runOnUILocalizedNumberFormat';
import type { UINumberAppearance, UINumberGeneralProps } from './types';

export function useNumberStaticStyles(integerColor: ColorVariants, decimalColor: ColorVariants) {
    const theme = useTheme();
    const integerColorStyle = React.useMemo(
        () => ({ color: theme[integerColor] }),
        [theme, integerColor],
    );
    const decimalColorStyle = React.useMemo(
        () => ({ color: theme[decimalColor] }),
        [theme, decimalColor],
    );

    return [integerColorStyle, decimalColorStyle];
}

export function UIStaticNumber({
    testID,
    children,
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    decimalAspect = UINumberDecimalAspect.None,
    sign,
}: UINumberGeneralProps & UINumberAppearance & { sign?: React.ReactNode }) {
    const value = useNumberValue(children, decimalAspect);
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    const formatted = React.useMemo(() => {
        return runOnUILocalizedNumberFormat(
            value,
            decimalAspect,
            decimalSeparator,
            integerGroupChar,
        );
    }, [value, decimalAspect, decimalSeparator]);

    const [integerColorStyle, decimalColorStyle] = useNumberStaticStyles(
        integerColor,
        decimalColor,
    );

    return (
        <Text testID={testID} accessibilityLabel={`${formatted.integer}${formatted.decimal}`}>
            <Text style={[Typography[integerVariant], styles.integerText, integerColorStyle]}>
                {formatted.integer}
            </Text>
            <Text style={[Typography[decimalVariant], styles.decimalText, decimalColorStyle]}>
                {formatted.decimal}
            </Text>
            {sign}
        </Text>
    );
}

const styles = StyleSheet.create({
    integerText: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        ...Platform.select({ web: {}, default: { lineHeight: undefined } }),
    },
    decimalText: {
        fontVariant: ['tabular-nums'],
    },
});
