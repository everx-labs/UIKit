import * as React from 'react';
import { Text, View } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { Typography, useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { localizedNumberFormat, UINumberDecimalAspect } from './localizedNumberFormat';
import type { UINumberAppearance, UINumberGeneralProps } from './types';
import { DebugGrid } from './DebugGrid';
import { styles } from './styles';
import { getDecimalPartDigitCount } from './getDecimalPartDigitCount';
import { useTextLikeContainer, useBaselineDiff } from './hooks';

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
    signBeforeNumber = false,
    showDebugGrid,
    showPositiveSign,
}: UINumberGeneralProps & UINumberAppearance & { sign?: React.ReactNode; signBeforeNumber?: boolean }) {
    const { decimal: decimalSeparator, grouping: integerGroupChar } =
        uiLocalized.localeInfo.numbers;

    const formatted = React.useMemo(() => {
        const decimalDigitCount = getDecimalPartDigitCount(value, decimalAspect);
        return localizedNumberFormat(
            value,
            decimalAspect,
            decimalDigitCount,
            decimalSeparator,
            integerGroupChar,
            showPositiveSign,
        );
    }, [value, decimalAspect, decimalSeparator, integerGroupChar, showPositiveSign]);

    /**
     * A dirty hack to respect default font scale setting of `Text`,
     * as it's a common solution on SO to disable font scaling.
     * Like here - https://stackoverflow.com/questions/41807843/how-to-disable-font-scaling-in-react-native-for-ios-app
     */
    const defaultAllowFontScaling = React.useRef(
        (Text as any).defaultProps?.allowFontScaling ?? true,
    ).current;

    const [integerColorStyle, decimalColorStyle] = useNumberStaticStyles(
        integerColor,
        decimalColor,
    );

    const textLikeContainer = useTextLikeContainer();

    const decimalWithIntegerBaselineDiff = useBaselineDiff(decimalVariant, integerVariant);

    return (
        <View
            style={textLikeContainer}
            testID={testID}
            accessibilityLabel={`${formatted.integer}${formatted.decimal}`}
        >
            {signBeforeNumber ? sign : null}
            {/* eslint-disable-next-line no-irregular-whitespace */}
            {signBeforeNumber ? <Text> </Text> : null}
            <Text
                testID="number-integer"
                style={[Typography[integerVariant], integerColorStyle, styles.integer]}
                selectable={false}
                allowFontScaling={defaultAllowFontScaling}
            >
                {formatted.integer}
            </Text>
            <Text
                testID="number-decimal"
                style={[
                    Typography[decimalVariant],
                    decimalColorStyle,
                    styles.decimal,
                    {
                        transform: [
                            {
                                translateY: decimalWithIntegerBaselineDiff,
                            },
                        ],
                    },
                ]}
                selectable={false}
                allowFontScaling={defaultAllowFontScaling}
            >
                {formatted.decimal}
            </Text>
            {signBeforeNumber ? null : sign}
            {showDebugGrid && <DebugGrid variant={integerVariant} />}
        </View>
    );
}
