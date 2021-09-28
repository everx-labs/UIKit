import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

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
    value: rawValue,
    integerVariant,
    integerColor,
    decimalVariant,
    decimalColor,
    decimalAspect = UINumberDecimalAspect.None,
}: UINumberGeneralProps & UINumberAppearance) {
    const value = useNumberValue(rawValue, decimalAspect);
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
        <Text>
            <Text style={[Typography[integerVariant], styles.integerText, integerColorStyle]}>
                {formatted.integer}
            </Text>
            <Text style={[Typography[decimalVariant], styles.decimalText, decimalColorStyle]}>
                {formatted.decimal}
            </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    integerText: {
        fontVariant: ['tabular-nums'],
        // reset RN styles to have proper vertical alignment
        padding: 0,
        lineHeight: undefined,
    },
    decimalText: {
        fontVariant: ['tabular-nums'],
    },
});
