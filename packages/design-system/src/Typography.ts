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

const InterFontFamily = 'Inter';

const InterFontNormalBold: TextStyle = {
    fontFamily: InterFontFamily,
    fontWeight: '600',
    // TODO: think if fontStyle is proper place to put it here
    // coz I could easily imagine some label with italic fontStyle
    // Ask Eugene if it appliable to typography
    fontStyle: 'normal',
};

const InterFontNormalRegular: TextStyle = {
    fontFamily: InterFontFamily,
    fontWeight: '500',
    fontStyle: 'normal',
};

const InterFontNormalThin: TextStyle = {
    fontFamily: InterFontFamily,
    fontWeight: '400',
    fontStyle: 'normal',
};

export const Typography: TypographyT = StyleSheet.create({
    [TypographyVariants.TitleHuge]: {
        ...InterFontNormalBold,
        fontSize: 38,
        lineHeight: 48,
        letterSpacing: -0.84,
    },
    [TypographyVariants.TitleLarge]: {
        ...InterFontNormalBold,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariants.TitleMedium]: {
        ...InterFontNormalBold,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariants.TitleSmall]: {
        ...InterFontNormalBold,
        fontSize: 19,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    [TypographyVariants.PromoHuge]: {
        ...InterFontNormalThin,
        fontSize: 38,
        lineHeight: 48,
        letterSpacing: -0.84,
    },
    [TypographyVariants.PromoLarge]: {
        ...InterFontNormalThin,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariants.PromoMedium]: {
        ...InterFontNormalThin,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariants.PromoSmall]: {
        ...InterFontNormalThin,
        fontSize: 19,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    [TypographyVariants.HeadlineHead]: {
        ...InterFontNormalBold,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.HeadlineSubhead]: {
        ...InterFontNormalBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.HeadlineFootnote]: {
        ...InterFontNormalBold,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.HeadlineLabel]: {
        ...InterFontNormalBold,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },
    [TypographyVariants.Action]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.ActionCallout]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.ActionFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ActionLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.ParagraphText]: {
        ...InterFontNormalThin,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.ParagraphNote]: {
        ...InterFontNormalThin,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariants.ParagraphFootnote]: {
        ...InterFontNormalThin,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ParagraphLabel]: {
        ...InterFontNormalThin,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.MonoText]: {
        ...InterFontNormalThin,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariants.MonoNote]: {
        ...InterFontNormalThin,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
});
