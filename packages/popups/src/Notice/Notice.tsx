import * as React from 'react';
import { ColorValue, View, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import {
    useTheme,
    ColorVariants,
    Theme,
    makeStyles,
    TypographyVariants,
    UILabel,
    UILinkButtonVariant,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';
import { NoticeProps, UINoticeType, UINoticeColor } from './types';
import { Action } from './Action';
import { CountdownCirlce } from './CountdownCircle';

const getBackgroundColor = (color: UINoticeColor, theme: Theme): ColorValue => {
    switch (color) {
        case UINoticeColor.Secondary:
            return theme[ColorVariants.BackgroundSecondary];
        case UINoticeColor.Negative:
            /**
             * TODO Add new color to ColorVariants
             */
            return (theme[ColorVariants.BackgroundNegative] as string) + '14';
        case UINoticeColor.PrimaryInverted:
        default:
            return theme[ColorVariants.BackgroundPrimaryInverted];
    }
};

export const getTitleColorVariant = (color: UINoticeColor): ColorVariants => {
    switch (color) {
        case UINoticeColor.Secondary:
        case UINoticeColor.Negative:
            return ColorVariants.TextPrimary;
        case UINoticeColor.PrimaryInverted:
        default:
            return ColorVariants.TextPrimaryInverted;
    }
};

export const getActionVariant = (color: UINoticeColor): UILinkButtonVariant => {
    switch (color) {
        case UINoticeColor.Negative:
            return UILinkButtonVariant.Negative;
        case UINoticeColor.Secondary:
        case UINoticeColor.PrimaryInverted:
        default:
            return UILinkButtonVariant.Neutral;
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
    onPress,
    onLongPress,
    onPressOut,
    action,
    countdownValue,
    countdownProgress,
}: NoticeProps) => {
    const theme = useTheme();
    const styles = useStyles(color, type, theme);
    return (
        <View style={styles.underlay}>
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={onPress}
                    onLongPress={onLongPress}
                    delayLongPress={UIConstant.notice.longPressDelay}
                    onPressOut={onPressOut}
                >
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={styles.countdown}>
                    <CountdownCirlce
                        countdownValue={countdownValue}
                        countdownProgress={countdownProgress}
                        color={getTitleColorVariant(color)}
                    />
                </View>
                <View style={styles.labelContainer} pointerEvents="none">
                    <UILabel
                        testID="message_default"
                        role={TypographyVariants.ParagraphNote}
                        color={getTitleColorVariant(color)}
                    >
                        {title}
                    </UILabel>
                </View>
                <Action action={action} variant={getActionVariant(color)} />
            </View>
        </View>
    );
};

const useStyles = makeStyles((color: UINoticeColor, type: UINoticeType, theme: Theme) => ({
    underlay: {
        maxWidth: UIConstant.notice.maxWidth,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: getBorderRadius(type),
        overflow: 'hidden',
        ...Platform.select({
            web: {
                cursor: 'pointer',
                touchAction: 'manipulation',
                userSelect: 'none',
            },
            default: null,
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getBackgroundColor(color, theme),
        paddingHorizontal: UIConstant.contentOffset,
    },
    labelContainer: {
        flex: 1,
        paddingVertical: UIConstant.contentInsetVerticalX3,
    },
    countdown: {
        paddingRight: UIConstant.contentInsetVerticalX2,
        zIndex: -10,
    },
}));
