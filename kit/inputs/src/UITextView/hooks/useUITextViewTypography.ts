import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { InputFont } from '../../Common';

function getTextViewTypographyVariant(font: InputFont | undefined) {
    switch (font) {
        case InputFont.Surf:
            return TypographyVariants.SurfParagraphNormal;
        case InputFont.Default:
        default:
            return TypographyVariants.ParagraphText;
    }
}

export function useUITextViewTypography(font: InputFont | undefined) {
    const inputTypographyStyle = React.useMemo(() => {
        const textViewTypographyVariant = getTextViewTypographyVariant(font);
        return StyleSheet.flatten(Typography[textViewTypographyVariant]);
    }, [font]);

    const textViewLineHeight = React.useMemo(
        () => inputTypographyStyle.lineHeight ?? UILayoutConstant.smallCellHeight,
        [inputTypographyStyle],
    );

    return { inputTypographyStyle, textViewLineHeight };
}
