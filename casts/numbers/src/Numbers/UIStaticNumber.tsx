import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { Typography, useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { localizedNumberFormat, UINumberDecimalAspect } from './localizedNumberFormat';
import type { UINumberAppearance, UINumberGeneralProps } from './types';
import { DebugGrid } from './DebugGrid';

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
    children: value,
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    decimalAspect = UINumberDecimalAspect.None,
    sign,
    showDebugGrid,
    showPositiveSign,
}: UINumberGeneralProps & UINumberAppearance & { sign?: React.ReactNode }) {
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    const formatted = React.useMemo(() => {
        return localizedNumberFormat(
            value,
            decimalAspect,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
        );
    }, [value, decimalAspect, decimalSeparator, integerGroupChar, showPositiveSign]);

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
            {showDebugGrid && <DebugGrid variant={decimalVariant} />}
        </Text>
    );
}

const styles = StyleSheet.create({
    integerText: {
        fontVariant: ['tabular-nums'],
    },
    decimalText: {
        fontVariant: ['tabular-nums'],
    },
});
