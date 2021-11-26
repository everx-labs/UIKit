import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

// eslint-disable-next-line no-shadow
export enum TypographyVariants {
    HeadersHuge = 'HeadersHuge',
    HeadersLarge = 'HeadersLarge',
    HeadersMedium = 'HeadersMedium',
    HeadersSmall = 'HeadersSmall',

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
    MonoFootnote = 'MonoFootnote',
    MonoLabel = 'MonoLabel',

    LightHuge = 'LightHuge',
    LightLarge = 'LightLarge',
    LightMedium = 'LightMedium',
    LightSmall = 'LightSmall',

    NarrowHeadlineText = 'NarrowHeadlineText',
    NarrowHeadlineNote = 'NarrowHeadlineNote',
    NarrowHeadlineFootnote = 'NarrowHeadlineFootnote',
    NarrowHeadlineLabel = 'NarrowHeadlineLabel',

    NarrowActionText = 'NarrowActionText',
    NarrowActionNote = 'NarrowActionNote',
    NarrowActionFootnote = 'NarrowActionFootnote',
    NarrowActionLabel = 'NarrowActionLabel',

    NarrowParagraphText = 'NarrowParagraphText',
    NarrowParagraphNote = 'NarrowParagraphNote',
    NarrowParagraphFootnote = 'NarrowParagraphFootnote',
    NarrowParagraphLabel = 'NarrowParagraphLabel',

    NarrowMonoText = 'NarrowMonoText',
    NarrowMonoNote = 'NarrowMonoNote',
    NarrowMonoFootnote = 'NarrowMonoFootnote',
    NarrowMonoLabel = 'NarrowMonoLabel',
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

// See picture here https://www.npmjs.com/package/font-measure#metrics-
// Calculated with https://codesandbox.io/s/npm-playground-forked-scqo2?file=/src/index.js
const interFontBaselineRatio = 0.25 / 1.15;
const interFontMiddlelineRatio = 0.58 / 1.15;
const interFontLowerlineRatio = 0.71 / 1.15;
const interFontUpperlineRatio = 0.92 / 1.15;
const interFontCapHeightRatio = 0.51;
const interFontDescentRatio = 1.05 / 1.15;

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

const InterFontNormalLight: TextStyle = {
    fontFamily: InterFont.light.fontFamily,
    fontWeight: '300',
    fontStyle: 'normal',
};

export const Typography: TypographyT = StyleSheet.create({
    [TypographyVariants.HeadersHuge]: {
        ...InterFontNormalMedium,
        fontSize: 33,
        lineHeight: 48,
        letterSpacing: -0.72,
    },
    [TypographyVariants.HeadersLarge]: {
        ...InterFontNormalMedium,
        fontSize: 29,
        lineHeight: 40,
        letterSpacing: -0.61,
    },
    [TypographyVariants.HeadersMedium]: {
        ...InterFontNormalMedium,
        fontSize: 25,
        lineHeight: 32,
        letterSpacing: -0.5,
    },
    [TypographyVariants.HeadersSmall]: {
        ...InterFontNormalMedium,
        fontSize: 21,
        lineHeight: 24,
        letterSpacing: -0.37,
    },

    [TypographyVariants.TitleHuge]: {
        ...InterFontNormalSemiBold,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
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
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
    },

    [TypographyVariants.PromoHuge]: {
        ...InterFontNormalRegular,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
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
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
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
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariants.HeadlineLabel]: {
        ...InterFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 16,
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
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ActionLabel]: {
        ...InterFontNormalMedium,
        fontSize: 11,
        lineHeight: 16,
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
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariants.ParagraphLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
    },

    [TypographyVariants.MonoText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.04,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
        fontVariant: ['tabular-nums'],
    },

    [TypographyVariants.LightHuge]: {
        ...InterFontNormalLight,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
    },
    [TypographyVariants.LightLarge]: {
        ...InterFontNormalLight,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariants.LightMedium]: {
        ...InterFontNormalLight,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariants.LightSmall]: {
        ...InterFontNormalLight,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
    },

    [TypographyVariants.NarrowHeadlineText]: {
        ...InterFontNormalSemiBold,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariants.NarrowHeadlineNote]: {
        ...InterFontNormalSemiBold,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariants.NarrowHeadlineFootnote]: {
        ...InterFontNormalSemiBold,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.NarrowHeadlineLabel]: {
        ...InterFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.NarrowActionText]: {
        ...InterFontNormalMedium,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariants.NarrowActionNote]: {
        ...InterFontNormalMedium,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariants.NarrowActionFootnote]: {
        ...InterFontNormalMedium,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.NarrowActionLabel]: {
        ...InterFontNormalMedium,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.NarrowParagraphText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariants.NarrowParagraphNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariants.NarrowParagraphFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariants.NarrowParagraphLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariants.NarrowMonoText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
        fontVariant: ['tabular-nums'],
    },
});

export function getFontMesurements(variant: TypographyVariants) {
    const { lineHeight } = StyleSheet.flatten(Typography[variant]);

    if (!lineHeight) {
        return null;
    }

    const baseline = interFontBaselineRatio * lineHeight;
    const lowerline = interFontLowerlineRatio * lineHeight;
    const middleline = interFontMiddlelineRatio * lineHeight;
    const upperline = interFontUpperlineRatio * lineHeight;
    const capHeight = interFontCapHeightRatio * lineHeight;
    const lowerHeight = lowerline - baseline;
    const descent = interFontDescentRatio * lineHeight;
    return {
        capHeight,
        lowerHeight,
        baseline,
        middleline,
        lowerline,
        upperline,
        descent,
        descentBottom: lineHeight - descent,
    };
}
