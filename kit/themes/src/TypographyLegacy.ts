import type { TextStyle } from 'react-native';

// eslint-disable-next-line no-shadow
export enum TypographyVariantsLegacy {
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

export type TypographyTLegacy = {
    [variant in TypographyVariantsLegacy]: TextStyle;
};

export type FontVariant = {
    fontFamily: string;
};

export type FontLegacy = {
    regular: FontVariant;
    medium: FontVariant;
    semiBold: FontVariant;
    light: FontVariant;
};

// See picture here https://www.npmjs.com/package/font-measure#metrics-
// Calculated with https://codesandbox.io/s/npm-playground-forked-scqo2?file=/src/index.js
export const fontBaseMetricsLegacy = {
    baselineRatio: 0.25 / 1.15,
    middlelineRatio: 0.58 / 1.15,
    lowerlineRatio: 0.71 / 1.15,
    upperlineRatio: 0.92 / 1.15,
    capHeightRatio: 0.51,
    descentRatio: 1.05 / 1.15,
};

// TODO Remove
export const InterFont: FontLegacy = {
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

export const TypographyLegacy: TypographyTLegacy = {
    [TypographyVariantsLegacy.HeadersHuge]: {
        ...InterFontNormalMedium,
        fontSize: 33,
        lineHeight: 48,
        letterSpacing: -0.72,
    },
    [TypographyVariantsLegacy.HeadersLarge]: {
        ...InterFontNormalMedium,
        fontSize: 29,
        lineHeight: 40,
        letterSpacing: -0.61,
    },
    [TypographyVariantsLegacy.HeadersMedium]: {
        ...InterFontNormalMedium,
        fontSize: 25,
        lineHeight: 32,
        letterSpacing: -0.5,
    },
    [TypographyVariantsLegacy.HeadersSmall]: {
        ...InterFontNormalMedium,
        fontSize: 21,
        lineHeight: 24,
        letterSpacing: -0.37,
    },

    [TypographyVariantsLegacy.TitleHuge]: {
        ...InterFontNormalSemiBold,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
    },
    [TypographyVariantsLegacy.TitleLarge]: {
        ...InterFontNormalSemiBold,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariantsLegacy.TitleMedium]: {
        ...InterFontNormalSemiBold,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariantsLegacy.TitleSmall]: {
        ...InterFontNormalSemiBold,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
    },

    [TypographyVariantsLegacy.PromoHuge]: {
        ...InterFontNormalRegular,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
    },
    [TypographyVariantsLegacy.PromoLarge]: {
        ...InterFontNormalRegular,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariantsLegacy.PromoMedium]: {
        ...InterFontNormalRegular,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariantsLegacy.PromoSmall]: {
        ...InterFontNormalRegular,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
    },

    [TypographyVariantsLegacy.HeadlineHead]: {
        ...InterFontNormalSemiBold,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.HeadlineSubhead]: {
        ...InterFontNormalSemiBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.HeadlineFootnote]: {
        ...InterFontNormalSemiBold,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.HeadlineLabel]: {
        ...InterFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.Action]: {
        ...InterFontNormalMedium,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.ActionCallout]: {
        ...InterFontNormalMedium,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.ActionFootnote]: {
        ...InterFontNormalMedium,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.ActionLabel]: {
        ...InterFontNormalMedium,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.ParagraphText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.ParagraphNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.ParagraphFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.ParagraphLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.MonoText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.22,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.MonoNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.13,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.MonoFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.04,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.MonoLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.05,
        fontVariant: ['tabular-nums'],
    },

    [TypographyVariantsLegacy.LightHuge]: {
        ...InterFontNormalLight,
        fontSize: 36,
        lineHeight: 48,
        letterSpacing: -0.79,
    },
    [TypographyVariantsLegacy.LightLarge]: {
        ...InterFontNormalLight,
        fontSize: 30,
        lineHeight: 40,
        letterSpacing: -0.64,
    },
    [TypographyVariantsLegacy.LightMedium]: {
        ...InterFontNormalLight,
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.4,
    },
    [TypographyVariantsLegacy.LightSmall]: {
        ...InterFontNormalLight,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.26,
    },

    [TypographyVariantsLegacy.NarrowHeadlineText]: {
        ...InterFontNormalSemiBold,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.NarrowHeadlineNote]: {
        ...InterFontNormalSemiBold,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.NarrowHeadlineFootnote]: {
        ...InterFontNormalSemiBold,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.NarrowHeadlineLabel]: {
        ...InterFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.NarrowActionText]: {
        ...InterFontNormalMedium,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.NarrowActionNote]: {
        ...InterFontNormalMedium,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.NarrowActionFootnote]: {
        ...InterFontNormalMedium,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.NarrowActionLabel]: {
        ...InterFontNormalMedium,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.NarrowParagraphText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
    },
    [TypographyVariantsLegacy.NarrowParagraphNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
    },
    [TypographyVariantsLegacy.NarrowParagraphFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
    },
    [TypographyVariantsLegacy.NarrowParagraphLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
    },

    [TypographyVariantsLegacy.NarrowMonoText]: {
        ...InterFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.22,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.NarrowMonoNote]: {
        ...InterFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: -0.13,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.NarrowMonoFootnote]: {
        ...InterFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.04,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariantsLegacy.NarrowMonoLabel]: {
        ...InterFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0.05,
        fontVariant: ['tabular-nums'],
    },
};
