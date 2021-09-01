import * as React from 'react';
import { ColorValue, View, Platform } from 'react-native';
import {
    useTheme,
    ColorVariants,
    Theme,
    makeStyles,
    TypographyVariants,
    UILabel,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';
import { NoticeProps, UINoticeType, UINoticeColor } from './types';

const getBackgroundColor = (color: UINoticeColor, theme: Theme): ColorValue => {
    switch (color) {
        case UINoticeColor.Secondary:
            return theme[ColorVariants.BackgroundSecondary];
        case UINoticeColor.Negative:
            return theme[ColorVariants.BackgroundNegative];
        case UINoticeColor.PrimaryInverted:
        default:
            return theme[ColorVariants.BackgroundPrimaryInverted];
    }
};

const getTitleColorVariant = (color: UINoticeColor): ColorVariants => {
    switch (color) {
        case UINoticeColor.Secondary:
            return ColorVariants.TextPrimary;
        case UINoticeColor.PrimaryInverted:
        case UINoticeColor.Negative:
        default:
            return ColorVariants.TextPrimaryInverted;
    }
};

const getBorderRadius = (type: UINoticeType): number => {
    switch (type) {
        case UINoticeType.BottomToast:
        case UINoticeType.TopToast:
        default:
            return UIConstant.alertBorderRadius;
    }
};

export const Notice: React.FC<NoticeProps> = ({
    type,
    title,
    color,
}: NoticeProps) => {
    const theme = useTheme();
    const styles = useStyles(color, type, theme);
    return (
        <View style={styles.container}>
            <UILabel
                testID="message_default"
                role={TypographyVariants.ParagraphFootnote}
                color={getTitleColorVariant(color)}
            >
                {title}
            </UILabel>
        </View>
    );
};

const useStyles = makeStyles(
    (color: UINoticeColor, type: UINoticeType, theme: Theme) => ({
        container: {
            maxWidth: UIConstant.notice.maxWidth,
            flex: 1,
            backgroundColor: getBackgroundColor(color, theme),
            borderRadius: getBorderRadius(type),
            padding: 16,
            ...Platform.select({
                web: {
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                },
                default: null,
            }),
        },
    }),
);
