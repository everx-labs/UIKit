import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import { UIPressableArea, UIPressableAreaProps } from '@tonlabs/uikit.controls';
import { ColorVariants, UILabel, UILabelRoles, useTheme } from '@tonlabs/uikit.themes';

import { UIHighlightsConstants } from './constants';
import { useHightlightsScrollRef } from './HighlightsScrollRefContext';

export enum UIHighlightCardTextLayout {
    Top,
    Bottom,
}

export enum UIHighlightCardForm {
    Square,
    Vertical,
    Horizontal,
}

interface UIHighlightCardProps extends Omit<UIPressableAreaProps, 'children' | 'waitFor'> {
    /**
     * Height of the card
     *
     * Default - 128
     */
    height?: number;
    /**
     * Whether title and caption block would be
     * on the top or bottom
     *
     * Default - Top
     */
    textLayout?: UIHighlightCardTextLayout;
    /**
     * Shape form of the card. Can be 3 types:
     * - Square (aspect ratio* - 1)
     * - Horizontal (aspect ratio - 1.5)
     * - Vertical (aspect ratio - 0.66)
     *
     * *aspect ratio applies to the height provided
     *
     * Default - Horizontal
     */
    form?: UIHighlightCardForm;
    /**
     * Title
     */
    title?: string;
    /**
     * Caption
     */
    caption?: string;
    /**
     * Square image inside the card.
     * Every card must have a cover.
     */
    cover: UIImageProps['source'];
    /**
     * Custom background color for the card.
     *
     * If you want to have default theme support please use ColorVariants.
     *
     * If you use custom color please consider to support both light and dark theme.
     */
    color?: ColorVariants | string;
}

export function UIHighlightCard({
    height = 128,
    textLayout = UIHighlightCardTextLayout.Top,
    form = UIHighlightCardForm.Horizontal,
    title,
    caption,
    cover,
    color = ColorVariants.BackgroundBW,
    ...pressableProps
}: UIHighlightCardProps) {
    const theme = useTheme();

    const backgroundColor = React.useMemo(() => {
        if (color in theme) {
            return theme[color as ColorVariants];
        }
        return color;
    }, [theme, color]);

    const width = React.useMemo(() => {
        return height * formToAspectRatioMapping[form];
    }, [height, form]);

    const scrollRef = useHightlightsScrollRef();

    return (
        <UIPressableArea
            // Change default hover scale factor
            // since the parent ScrollView has an intrinsic height,
            // hence the scale factor > 1 leads to cut vertical edges of the card
            scaleParameters={{ hovered: 0.99 }}
            waitFor={scrollRef}
            {...pressableProps}
        >
            <View
                style={[
                    styles.container,
                    formToStyleMapping[form],
                    { width, height, backgroundColor },
                ]}
            >
                <UIImage
                    style={[
                        styles.cover,
                        {
                            width: Math.min(width, height),
                            height: Math.min(width, height),
                        },
                    ]}
                    source={cover}
                />
                {title !== '' && (
                    <View style={[styles.description, textLayoutToStyleMapping[textLayout]]}>
                        <View>
                            <UILabel
                                role={UILabelRoles.TitleSmall}
                                color={ColorVariants.TextPrimary}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {title}
                            </UILabel>
                            {caption !== '' && (
                                <UILabel
                                    role={UILabelRoles.ParagraphFootnote}
                                    color={ColorVariants.TextSecondary}
                                    ellipsizeMode="tail"
                                    numberOfLines={4}
                                >
                                    {caption}
                                </UILabel>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </UIPressableArea>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: UIHighlightsConstants.cardBorderRaduis,
    },
    square: {},
    vertical: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cover: {
        borderRadius: UIHighlightsConstants.cardBorderRaduis,
    },
    description: {
        position: 'absolute',
        top: UIHighlightsConstants.cardDescriptionOffset,
        left: UIHighlightsConstants.cardDescriptionOffset,
        bottom: UIHighlightsConstants.cardDescriptionOffset,
        right: UIHighlightsConstants.cardDescriptionOffset,
    },
    descriptionTop: {
        justifyContent: 'flex-start',
    },
    descriptionBottom: {
        justifyContent: 'flex-end',
    },
});

const formToAspectRatioMapping = {
    [UIHighlightCardForm.Square]: 1,
    [UIHighlightCardForm.Vertical]: 0.66,
    [UIHighlightCardForm.Horizontal]: 1.5,
};

const formToStyleMapping = {
    [UIHighlightCardForm.Square]: styles.square,
    [UIHighlightCardForm.Vertical]: styles.vertical,
    [UIHighlightCardForm.Horizontal]: styles.horizontal,
};

const textLayoutToStyleMapping = {
    [UIHighlightCardTextLayout.Top]: styles.descriptionTop,
    [UIHighlightCardTextLayout.Bottom]: styles.descriptionBottom,
};
