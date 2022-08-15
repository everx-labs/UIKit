import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

// eslint-disable-next-line no-shadow
export enum TypographyVariants {
    SurfTitleGreat = 'SurfTitleGreat',
    SurfTitleHuge = 'SurfTitleHuge',
    SurfTitleLarge = 'SurfTitleLarge',
    SurfTitleNormal = 'SurfTitleNormal',
    SurfTitleMedium = 'SurfTitleMedium',
    SurfTitleSmall = 'SurfTitleSmall',
    SurfTitleTiny = 'SurfTitleTiny',
    SurfTitleSpecial = 'SurfTitleSpecial',

    SurfActionGreat = 'SurfActionGreat',
    SurfActionHuge = 'SurfActionHuge',
    SurfActionLarge = 'SurfActionLarge',
    SurfActionNormal = 'SurfActionNormal',
    SurfActionMedium = 'SurfActionMedium',
    SurfActionSmall = 'SurfActionSmall',
    SurfActionTiny = 'SurfActionTiny',
    SurfActionSpecial = 'SurfActionSpecial',

    SurfParagraphGreat = 'SurfParagraphGreat',
    SurfParagraphHuge = 'SurfParagraphHuge',
    SurfParagraphLarge = 'SurfParagraphLarge',
    SurfParagraphNormal = 'SurfParagraphNormal',
    SurfParagraphMedium = 'SurfParagraphMedium',
    SurfParagraphSmall = 'SurfParagraphSmall',
    SurfParagraphTiny = 'SurfParagraphTiny',
    SurfParagraphSpecial = 'SurfParagraphSpecial',

    SurfMonoGreat = 'SurfMonoGreat',
    SurfMonoHuge = 'SurfMonoHuge',
    SurfMonoLarge = 'SurfMonoLarge',
    SurfMonoNormal = 'SurfMonoNormal',
    SurfMonoMedium = 'SurfMonoMedium',
    SurfMonoSmall = 'SurfMonoSmall',
    SurfMonoTiny = 'SurfMonoTiny',
    SurfMonoSpecial = 'SurfMonoSpecial',

    SurfHeadlineBiggest = 'SurfHeadlineBiggest',
    SurfHeadlineBig = 'SurfHeadlineBig',
    SurfHeadlineLittle = 'SurfHeadlineLittle',

    /** Legacy */
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
    bold: FontVariant;
    extraBold: FontVariant;
};

// See picture here https://www.npmjs.com/package/font-measure#metrics-
// Calculated with https://codesandbox.io/s/npm-playground-forked-bniuv8?file=/src/index.js
const ManropeFontBaselineRatio = 0.23;
const ManropeFontMiddlelineRatio = 0.51;
const ManropeFontLowerlineRatio = 0.77;
const ManropeFontUpperlineRatio = 0.95;
const ManropeFontCapHeightRatio = 0.72;
const ManropeFontDescentRatio = 1.01;

export const ManropeFont: Font = {
    extraBold: {
        fontFamily: 'Manrope-ExtraBold',
    },
    bold: {
        fontFamily: 'Manrope-Bold',
    },
    semiBold: {
        fontFamily: 'Manrope-SemiBold',
    },
    medium: {
        fontFamily: 'Manrope-Medium',
    },
    regular: {
        fontFamily: 'Manrope-Regular',
    },
};

const ManropeFontNormalExtraBold: TextStyle = {
    fontFamily: ManropeFont.extraBold.fontFamily,
    fontWeight: '800',
    fontStyle: 'normal',
};

const ManropeFontNormalBold: TextStyle = {
    fontFamily: ManropeFont.bold.fontFamily,
    fontWeight: '700',
    fontStyle: 'normal',
};

const ManropeFontNormalSemiBold: TextStyle = {
    fontFamily: ManropeFont.semiBold.fontFamily,
    fontWeight: '600',
    fontStyle: 'normal',
};

const ManropeFontNormalMedium: TextStyle = {
    fontFamily: ManropeFont.medium.fontFamily,
    fontWeight: '500',
    fontStyle: 'normal',
};

const ManropeFontNormalRegular: TextStyle = {
    fontFamily: ManropeFont.regular.fontFamily,
    fontWeight: '400',
    fontStyle: 'normal',
};

const FontSizeHeadlineBiggest: TextStyle = {
    fontSize: 80,
    lineHeight: 112,
};

const FontSizeHeadlineBig: TextStyle = {
    fontSize: 64,
    lineHeight: 96,
};

const FontSizeHeadlineLittle: TextStyle = {
    fontSize: 48,
    lineHeight: 72,
};

const FontSizeGreat: TextStyle = {
    fontSize: 48,
    lineHeight: 72,
};

const FontSizeHuge: TextStyle = {
    fontSize: 32,
    lineHeight: 48,
};

const FontSizeLarge: TextStyle = {
    fontSize: 22,
    lineHeight: 32,
};

const FontSizeNormal: TextStyle = {
    fontSize: 16,
    lineHeight: 24,
};

const FontSizeMedium: TextStyle = {
    fontSize: 14,
    lineHeight: 20,
};

const FontSizeSpecial: TextStyle = {
    fontSize: 14,
    lineHeight: 20,
};

const FontSizeSmall: TextStyle = {
    fontSize: 12,
    lineHeight: 16,
};

const FontSizeTiny: TextStyle = {
    fontSize: 10,
    lineHeight: 12,
};

export const Typography: TypographyT = StyleSheet.create({
    /** SurfTitle */
    [TypographyVariants.SurfTitleGreat]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeGreat,
    },
    [TypographyVariants.SurfTitleHuge]: {
        ...ManropeFontNormalBold,
        ...FontSizeHuge,
    },
    [TypographyVariants.SurfTitleLarge]: {
        ...ManropeFontNormalBold,
        ...FontSizeLarge,
    },
    [TypographyVariants.SurfTitleNormal]: {
        ...ManropeFontNormalBold,
        ...FontSizeNormal,
    },
    [TypographyVariants.SurfTitleMedium]: {
        ...ManropeFontNormalBold,
        ...FontSizeMedium,
    },
    [TypographyVariants.SurfTitleSmall]: {
        ...ManropeFontNormalBold,
        ...FontSizeSmall,
    },
    [TypographyVariants.SurfTitleTiny]: {
        ...ManropeFontNormalBold,
        ...FontSizeTiny,
    },
    [TypographyVariants.SurfTitleSpecial]: {
        ...ManropeFontNormalBold,
        ...FontSizeSpecial,
    },

    /** SurfAction */
    [TypographyVariants.SurfActionGreat]: {
        ...ManropeFontNormalMedium,
        ...FontSizeGreat,
    },
    [TypographyVariants.SurfActionHuge]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeHuge,
    },
    [TypographyVariants.SurfActionLarge]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeLarge,
    },
    [TypographyVariants.SurfActionNormal]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeNormal,
    },
    [TypographyVariants.SurfActionMedium]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeMedium,
    },
    [TypographyVariants.SurfActionSmall]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeSmall,
    },
    [TypographyVariants.SurfActionTiny]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeTiny,
    },
    [TypographyVariants.SurfActionSpecial]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeSpecial,
    },

    /** SurfParagraph */
    [TypographyVariants.SurfParagraphGreat]: {
        ...ManropeFontNormalRegular,
        ...FontSizeGreat,
    },
    [TypographyVariants.SurfParagraphHuge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeHuge,
    },
    [TypographyVariants.SurfParagraphLarge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },
    [TypographyVariants.SurfParagraphNormal]: {
        ...ManropeFontNormalMedium,
        ...FontSizeNormal,
    },
    [TypographyVariants.SurfParagraphMedium]: {
        ...ManropeFontNormalMedium,
        ...FontSizeMedium,
    },
    [TypographyVariants.SurfParagraphSmall]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSmall,
    },
    [TypographyVariants.SurfParagraphTiny]: {
        ...ManropeFontNormalMedium,
        ...FontSizeTiny,
    },
    [TypographyVariants.SurfParagraphSpecial]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSpecial,
    },

    /** SurfMono */
    [TypographyVariants.SurfMonoGreat]: {
        ...ManropeFontNormalRegular,
        ...FontSizeGreat,
    },
    [TypographyVariants.SurfMonoHuge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeHuge,
    },
    [TypographyVariants.SurfMonoLarge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },
    [TypographyVariants.SurfMonoNormal]: {
        ...ManropeFontNormalMedium,
        ...FontSizeNormal,
    },
    [TypographyVariants.SurfMonoMedium]: {
        ...ManropeFontNormalMedium,
        ...FontSizeMedium,
    },
    [TypographyVariants.SurfMonoSmall]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSmall,
    },
    [TypographyVariants.SurfMonoTiny]: {
        ...ManropeFontNormalMedium,
        ...FontSizeTiny,
    },
    [TypographyVariants.SurfMonoSpecial]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSpecial,
    },

    /** SurfHeadline */
    [TypographyVariants.SurfHeadlineBiggest]: {
        ...ManropeFontNormalExtraBold,
        ...FontSizeHeadlineBiggest,
    },
    [TypographyVariants.SurfHeadlineBig]: {
        ...ManropeFontNormalExtraBold,
        ...FontSizeHeadlineBig,
    },
    [TypographyVariants.SurfHeadlineLittle]: {
        ...ManropeFontNormalExtraBold,
        ...FontSizeHeadlineLittle,
    },

    /** Legacy */
    [TypographyVariants.HeadersHuge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeGreat,
    },
    [TypographyVariants.HeadersLarge]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeHuge,
    },
    [TypographyVariants.HeadersMedium]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeHuge,
    },
    [TypographyVariants.HeadersSmall]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeNormal,
    },

    [TypographyVariants.TitleHuge]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeGreat,
    },
    [TypographyVariants.TitleLarge]: {
        ...ManropeFontNormalBold,
        ...FontSizeHuge,
    },
    [TypographyVariants.TitleMedium]: {
        ...ManropeFontNormalBold,
        ...FontSizeLarge,
    },
    [TypographyVariants.TitleSmall]: {
        ...ManropeFontNormalBold,
        ...FontSizeLarge,
    },

    [TypographyVariants.PromoHuge]: {
        ...ManropeFontNormalRegular,
        ...FontSizeGreat,
    },
    [TypographyVariants.PromoLarge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeHuge,
    },
    [TypographyVariants.PromoMedium]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },
    [TypographyVariants.PromoSmall]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },

    [TypographyVariants.HeadlineHead]: {
        ...ManropeFontNormalBold,
        ...FontSizeNormal,
    },
    [TypographyVariants.HeadlineSubhead]: {
        ...ManropeFontNormalBold,
        ...FontSizeMedium,
    },
    [TypographyVariants.HeadlineFootnote]: {
        ...ManropeFontNormalBold,
        ...FontSizeSmall,
    },
    [TypographyVariants.HeadlineLabel]: {
        ...ManropeFontNormalBold,
        ...FontSizeTiny,
    },

    [TypographyVariants.Action]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeNormal,
    },
    [TypographyVariants.ActionCallout]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeMedium,
    },
    [TypographyVariants.ActionFootnote]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeSmall,
    },
    [TypographyVariants.ActionLabel]: {
        ...ManropeFontNormalSemiBold,
        ...FontSizeTiny,
    },

    [TypographyVariants.ParagraphText]: {
        ...ManropeFontNormalMedium,
        ...FontSizeNormal,
    },
    [TypographyVariants.ParagraphNote]: {
        ...ManropeFontNormalMedium,
        ...FontSizeMedium,
    },
    [TypographyVariants.ParagraphFootnote]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSmall,
    },
    [TypographyVariants.ParagraphLabel]: {
        ...ManropeFontNormalMedium,
        ...FontSizeTiny,
    },

    [TypographyVariants.MonoText]: {
        ...ManropeFontNormalMedium,
        ...FontSizeNormal,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoNote]: {
        ...ManropeFontNormalMedium,
        ...FontSizeMedium,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoFootnote]: {
        ...ManropeFontNormalMedium,
        ...FontSizeSmall,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoLabel]: {
        ...ManropeFontNormalMedium,
        ...FontSizeTiny,
        fontVariant: ['tabular-nums'],
    },

    [TypographyVariants.LightHuge]: {
        ...ManropeFontNormalRegular,
        ...FontSizeGreat,
    },
    [TypographyVariants.LightLarge]: {
        ...ManropeFontNormalMedium,
        ...FontSizeHuge,
    },
    [TypographyVariants.LightMedium]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },
    [TypographyVariants.LightSmall]: {
        ...ManropeFontNormalMedium,
        ...FontSizeLarge,
    },

    [TypographyVariants.NarrowHeadlineText]: {
        ...ManropeFontNormalSemiBold,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowHeadlineNote]: {
        ...ManropeFontNormalSemiBold,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowHeadlineFootnote]: {
        ...ManropeFontNormalSemiBold,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowHeadlineLabel]: {
        ...ManropeFontNormalSemiBold,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowActionText]: {
        ...ManropeFontNormalMedium,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowActionNote]: {
        ...ManropeFontNormalMedium,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowActionFootnote]: {
        ...ManropeFontNormalMedium,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowActionLabel]: {
        ...ManropeFontNormalMedium,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowParagraphText]: {
        ...ManropeFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowParagraphNote]: {
        ...ManropeFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowParagraphFootnote]: {
        ...ManropeFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowParagraphLabel]: {
        ...ManropeFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowMonoText]: {
        ...ManropeFontNormalRegular,
        fontSize: 17,
        lineHeight: 20,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoNote]: {
        ...ManropeFontNormalRegular,
        fontSize: 15,
        lineHeight: 16,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoFootnote]: {
        ...ManropeFontNormalRegular,
        fontSize: 13,
        lineHeight: 16,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoLabel]: {
        ...ManropeFontNormalRegular,
        fontSize: 11,
        lineHeight: 12,
        fontVariant: ['tabular-nums'],
    },
});

export function getFontMesurements(variant: TypographyVariants) {
    const { lineHeight } = StyleSheet.flatten(Typography[variant]);

    if (!lineHeight) {
        return null;
    }

    const baseline = ManropeFontBaselineRatio * lineHeight;
    const lowerline = ManropeFontLowerlineRatio * lineHeight;
    const middleline = ManropeFontMiddlelineRatio * lineHeight;
    const upperline = ManropeFontUpperlineRatio * lineHeight;
    const capHeight = ManropeFontCapHeightRatio * lineHeight;
    const lowerHeight = lowerline - baseline;
    const descent = ManropeFontDescentRatio * lineHeight;
    return {
        lineHeight,
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
