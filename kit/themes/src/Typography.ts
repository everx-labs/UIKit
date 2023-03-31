import { Platform, StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';
import { fontBaseMetricsLegacy, TypographyLegacy } from './TypographyLegacy';

/**
 * Flag to turn to the old typography
 */
export const isLegacyTypographyEnabled = true;

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
export const fontBaseMetrics = isLegacyTypographyEnabled
    ? fontBaseMetricsLegacy
    : Platform.select({
          ios: {
              baselineRatio: 0.24,
              middlelineRatio: 0.41,
              lowerlineRatio: 0.62,
              upperlineRatio: 0.74,
              capHeightRatio: 0.5,
              descentRatio: 1.01,
          },
          android: {
              baselineRatio: 0.2,
              middlelineRatio: 0.37,
              lowerlineRatio: 0.59,
              upperlineRatio: 0.7,
              capHeightRatio: 0.5,
              descentRatio: 1.01,
          },
          default: {
              baselineRatio: 0.23,
              middlelineRatio: 0.4,
              lowerlineRatio: 0.615,
              upperlineRatio: 0.73,
              capHeightRatio: 0.5,
              descentRatio: 1.01,
          },
      });

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

type FontStyleVariant =
    | 'NormalExtraBold'
    | 'NormalBold'
    | 'NormalSemiBold'
    | 'NormalMedium'
    | 'NormalRegular';

const FontStyle: Record<FontStyleVariant, TextStyle> = {
    NormalExtraBold: {
        fontFamily: ManropeFont.extraBold.fontFamily,
        fontWeight: '800',
        fontStyle: 'normal',
    },
    NormalBold: {
        fontFamily: ManropeFont.bold.fontFamily,
        fontWeight: '700',
        fontStyle: 'normal',
    },
    NormalSemiBold: {
        fontFamily: ManropeFont.semiBold.fontFamily,
        fontWeight: '600',
        fontStyle: 'normal',
    },
    NormalMedium: {
        fontFamily: ManropeFont.medium.fontFamily,
        fontWeight: '500',
        fontStyle: 'normal',
    },
    NormalRegular: {
        fontFamily: ManropeFont.regular.fontFamily,
        fontWeight: '400',
        fontStyle: 'normal',
    },
};

const FontSize = {
    HeadlineBiggest: {
        fontSize: 80,
        lineHeight: 112,
    },
    HeadlineBig: {
        fontSize: 64,
        lineHeight: 96,
    },
    HeadlineLittle: {
        fontSize: 48,
        lineHeight: 72,
    },
    Great: {
        fontSize: 48,
        lineHeight: 72,
    },
    Huge: {
        fontSize: 32,
        lineHeight: 48,
    },
    Large: {
        fontSize: 22,
        lineHeight: 32,
    },
    Normal: {
        fontSize: 16,
        lineHeight: 24,
    },
    Medium: {
        fontSize: 14,
        lineHeight: 20,
    },
    Special: {
        fontSize: 14,
        lineHeight: 24,
    },
    Small: {
        fontSize: 12,
        lineHeight: 16,
    },
    Tiny: {
        fontSize: 10,
        lineHeight: 12,
    },
};

export const Typography: TypographyT = StyleSheet.create({
    /** SurfTitle */
    [TypographyVariants.SurfTitleGreat]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Great,
    },
    [TypographyVariants.SurfTitleHuge]: {
        ...FontStyle.NormalBold,
        ...FontSize.Huge,
    },
    [TypographyVariants.SurfTitleLarge]: {
        ...FontStyle.NormalBold,
        ...FontSize.Large,
    },
    [TypographyVariants.SurfTitleNormal]: {
        ...FontStyle.NormalBold,
        ...FontSize.Normal,
    },
    [TypographyVariants.SurfTitleMedium]: {
        ...FontStyle.NormalBold,
        ...FontSize.Medium,
    },
    [TypographyVariants.SurfTitleSmall]: {
        ...FontStyle.NormalBold,
        ...FontSize.Small,
    },
    [TypographyVariants.SurfTitleTiny]: {
        ...FontStyle.NormalBold,
        ...FontSize.Tiny,
    },
    [TypographyVariants.SurfTitleSpecial]: {
        ...FontStyle.NormalBold,
        ...FontSize.Special,
    },

    /** SurfAction */
    [TypographyVariants.SurfActionGreat]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Great,
    },
    [TypographyVariants.SurfActionHuge]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Huge,
    },
    [TypographyVariants.SurfActionLarge]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Large,
    },
    [TypographyVariants.SurfActionNormal]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Normal,
    },
    [TypographyVariants.SurfActionMedium]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Medium,
    },
    [TypographyVariants.SurfActionSmall]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Small,
    },
    [TypographyVariants.SurfActionTiny]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Tiny,
    },
    [TypographyVariants.SurfActionSpecial]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Special,
    },

    /** SurfParagraph */
    [TypographyVariants.SurfParagraphGreat]: {
        ...FontStyle.NormalRegular,
        ...FontSize.Great,
    },
    [TypographyVariants.SurfParagraphHuge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Huge,
    },
    [TypographyVariants.SurfParagraphLarge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },
    [TypographyVariants.SurfParagraphNormal]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Normal,
    },
    [TypographyVariants.SurfParagraphMedium]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Medium,
    },
    [TypographyVariants.SurfParagraphSmall]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Small,
    },
    [TypographyVariants.SurfParagraphTiny]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Tiny,
    },
    [TypographyVariants.SurfParagraphSpecial]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Special,
    },

    /** SurfMono */
    [TypographyVariants.SurfMonoGreat]: {
        ...FontStyle.NormalRegular,
        ...FontSize.Great,
    },
    [TypographyVariants.SurfMonoHuge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Huge,
    },
    [TypographyVariants.SurfMonoLarge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },
    [TypographyVariants.SurfMonoNormal]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Normal,
    },
    [TypographyVariants.SurfMonoMedium]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Medium,
    },
    [TypographyVariants.SurfMonoSmall]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Small,
    },
    [TypographyVariants.SurfMonoTiny]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Tiny,
    },
    [TypographyVariants.SurfMonoSpecial]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Special,
    },

    /** SurfHeadline */
    [TypographyVariants.SurfHeadlineBiggest]: {
        ...FontStyle.NormalExtraBold,
        ...FontSize.HeadlineBiggest,
    },
    [TypographyVariants.SurfHeadlineBig]: {
        ...FontStyle.NormalExtraBold,
        ...FontSize.HeadlineBig,
    },
    [TypographyVariants.SurfHeadlineLittle]: {
        ...FontStyle.NormalExtraBold,
        ...FontSize.HeadlineLittle,
    },

    /** Legacy */
    [TypographyVariants.HeadersHuge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Great,
    },
    [TypographyVariants.HeadersLarge]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Huge,
    },
    [TypographyVariants.HeadersMedium]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Huge,
    },
    [TypographyVariants.HeadersSmall]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Normal,
    },

    [TypographyVariants.TitleHuge]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Great,
    },
    [TypographyVariants.TitleLarge]: {
        ...FontStyle.NormalBold,
        ...FontSize.Huge,
    },
    [TypographyVariants.TitleMedium]: {
        ...FontStyle.NormalBold,
        ...FontSize.Large,
    },
    [TypographyVariants.TitleSmall]: {
        ...FontStyle.NormalBold,
        ...FontSize.Large,
    },

    [TypographyVariants.PromoHuge]: {
        ...FontStyle.NormalRegular,
        ...FontSize.Great,
    },
    [TypographyVariants.PromoLarge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Huge,
    },
    [TypographyVariants.PromoMedium]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },
    [TypographyVariants.PromoSmall]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },

    [TypographyVariants.HeadlineHead]: {
        ...FontStyle.NormalBold,
        ...FontSize.Normal,
    },
    [TypographyVariants.HeadlineSubhead]: {
        ...FontStyle.NormalBold,
        ...FontSize.Medium,
    },
    [TypographyVariants.HeadlineFootnote]: {
        ...FontStyle.NormalBold,
        ...FontSize.Small,
    },
    [TypographyVariants.HeadlineLabel]: {
        ...FontStyle.NormalBold,
        ...FontSize.Tiny,
    },

    [TypographyVariants.Action]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Normal,
    },
    [TypographyVariants.ActionCallout]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Medium,
    },
    [TypographyVariants.ActionFootnote]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Small,
    },
    [TypographyVariants.ActionLabel]: {
        ...FontStyle.NormalSemiBold,
        ...FontSize.Tiny,
    },

    [TypographyVariants.ParagraphText]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Normal,
    },
    [TypographyVariants.ParagraphNote]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Medium,
    },
    [TypographyVariants.ParagraphFootnote]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Small,
    },
    [TypographyVariants.ParagraphLabel]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Tiny,
    },

    [TypographyVariants.MonoText]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Normal,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoNote]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Medium,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoFootnote]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Small,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.MonoLabel]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Tiny,
        fontVariant: ['tabular-nums'],
    },

    [TypographyVariants.LightHuge]: {
        ...FontStyle.NormalRegular,
        ...FontSize.Great,
    },
    [TypographyVariants.LightLarge]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Huge,
    },
    [TypographyVariants.LightMedium]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },
    [TypographyVariants.LightSmall]: {
        ...FontStyle.NormalMedium,
        ...FontSize.Large,
    },

    [TypographyVariants.NarrowHeadlineText]: {
        ...FontStyle.NormalSemiBold,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowHeadlineNote]: {
        ...FontStyle.NormalSemiBold,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowHeadlineFootnote]: {
        ...FontStyle.NormalSemiBold,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowHeadlineLabel]: {
        ...FontStyle.NormalSemiBold,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowActionText]: {
        ...FontStyle.NormalMedium,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowActionNote]: {
        ...FontStyle.NormalMedium,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowActionFootnote]: {
        ...FontStyle.NormalMedium,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowActionLabel]: {
        ...FontStyle.NormalMedium,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowParagraphText]: {
        ...FontStyle.NormalRegular,
        fontSize: 17,
        lineHeight: 20,
    },
    [TypographyVariants.NarrowParagraphNote]: {
        ...FontStyle.NormalRegular,
        fontSize: 15,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowParagraphFootnote]: {
        ...FontStyle.NormalRegular,
        fontSize: 13,
        lineHeight: 16,
    },
    [TypographyVariants.NarrowParagraphLabel]: {
        ...FontStyle.NormalRegular,
        fontSize: 11,
        lineHeight: 12,
    },

    [TypographyVariants.NarrowMonoText]: {
        ...FontStyle.NormalRegular,
        fontSize: 17,
        lineHeight: 20,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoNote]: {
        ...FontStyle.NormalRegular,
        fontSize: 15,
        lineHeight: 16,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoFootnote]: {
        ...FontStyle.NormalRegular,
        fontSize: 13,
        lineHeight: 16,
        fontVariant: ['tabular-nums'],
    },
    [TypographyVariants.NarrowMonoLabel]: {
        ...FontStyle.NormalRegular,
        fontSize: 11,
        lineHeight: 12,
        fontVariant: ['tabular-nums'],
    },
    ...(isLegacyTypographyEnabled ? TypographyLegacy : null),
});

export type FontMeasurements = {
    lineHeight: number;
    capHeight: number;
    lowerHeight: number;
    baseline: number;
    middleline: number;
    lowerline: number;
    upperline: number;
    descent: number;
    descentBottom: number;
};

export function getFontMeasurements(variant: TypographyVariants): FontMeasurements {
    const { lineHeight = FontSize.Medium.lineHeight } = StyleSheet.flatten(Typography[variant]);

    const baseline = fontBaseMetrics.baselineRatio * lineHeight;
    const lowerline = fontBaseMetrics.lowerlineRatio * lineHeight;
    const middleline = fontBaseMetrics.middlelineRatio * lineHeight;
    const upperline = fontBaseMetrics.upperlineRatio * lineHeight;
    const capHeight = fontBaseMetrics.capHeightRatio * lineHeight;
    const lowerHeight = lowerline - baseline;
    const descent = fontBaseMetrics.descentRatio * lineHeight;
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
