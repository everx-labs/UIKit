import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

export enum TypographyVariants {
    TitleHuge = 'TitleHuge',
    TitleLarge = 'TitleLarge',
    TitleMedium = 'TitleMedium',
    TitleSmall = 'TitleSmall',
    PromoHuge = 'PromoHuge',
    PromoLarge = 'PromoLarge',
    PromoMedium = 'PromoMedium',
    PromoSmall = 'PromoSmall',
    HeadlineHead = 'HeadlineHead',
    HeadlineSubhead = 'HeadlineSubhead',
    HeadlineFootnote = 'HeadlineFootnote',
    HeadlineLabel = 'HeadlineLabel',
    Action = 'Action',
    ActionCallout = 'ActionCallout',
    ActionFootnote = 'ActionFootnote',
    ActionLabel = 'ActionLabel',
    ParagraphText = 'ParagraphText',
    ParagraphNote = 'ParagraphNote',
    ParagraphFootnote = 'ParagraphFootnote',
    ParagraphLabel = 'ParagraphLabel',
    MonoText = 'MonoText',
    MonoNote = 'MonoNote',
}

export type TypographyT = {
    [variant in TypographyVariants]: TextStyle;
};

export type FontVariant = {
    fontFamily: string;
};

export type Font = {
    regular: FontVariant;
    medium: FontVariant;
    semiBold: FontVariant;
    light: FontVariant;
};

export const InterFont: Font = {
    semiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    light: {
        fontFamily: 'Inter-Light',
    },
    medium: {
        fontFamily: 'Inter-Medium',
    },
    regular: {
        fontFamily: 'Inter-Regular',
    },
};

const InterFontNormalSemiBold: TextStyle = {
    fontFamily: InterFont.semiBold.fontFamily,
    fontWeight: '600',
    // TODO: think if fontStyle is proper place to put it here
    // coz I could easily imagine some label with italic fontStyle
    // Ask Eugene if it appliable to typography
    fontStyle: 'normal',
};

const InterFontNormalMedium: TextStyle = {
    fontFamily: InterFont.medium.fontFamily,
    fontWeight: '500',
    fontStyle: 'normal',
};

const InterFontNormalRegular: TextStyle = {
    fontFamily: InterFont.regular.fontFamily,
    fontWeight: '400',
    fontStyle: 'normal',
};

export const Typography: TypographyT = StyleSheet.create({
    [TypographyVariants.TitleHuge]: {
        ...InterFontNormalSemiBold,
        fontSize: 38,
        lineHeight: 48,
        letterSpacing: -0.84,
    },
    [TypographyVariants.TitleLarge]: {
        ...InterFontNormalSemiBold,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariants.TitleMedium]: {
        ...InterFontNormalSemiBold,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariants.TitleSmall]: {
        ...InterFontNormalSemiBold,
        fontSize: 19,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    [TypographyVariants.PromoHuge]: {
        ...InterFontNormalRegular,
        fontSize: 38,
        lineHeight: 48,
        letterSpacing: -0.84,
    },
    [TypographyVariants.PromoLarge]: {
        ...InterFontNormalRegular,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariants.PromoMedium]: {
        ...InterFontNormalRegular,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariants.PromoSmall]: {
        ...InterFontNormalRegular,
        fontSize: 19,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    [TypographyVariants.HeadlineHead]: {
        ...InterFontNormalSemiBold,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.HeadlineSubhead]: {
        ...InterFontNormalSemiBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.HeadlineFootnote]: {
        ...InterFontNormalSemiBold,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.HeadlineLabel]: {
        ...InterFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },
    [TypographyVariants.Action]: {
        ...InterFontNormalMedium,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.ActionCallout]: {
        ...InterFontNormalMedium,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.ActionFootnote]: {
        ...InterFontNormalMedium,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ActionLabel]: {
        ...InterFontNormalMedium,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.ParagraphText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.ParagraphNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.ParagraphFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ParagraphLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.MonoText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.MonoNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
});
