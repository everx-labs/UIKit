import * as React from 'react';
import {
    ColorValue,
    View,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import type Animated from 'react-native-reanimated';
import { UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    useTheme,
    Theme,
    makeStyles,
} from '@tonlabs/uikit.themes';
import { UIConstant } from './constants';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { NoticeProps, UINoticeType, UINoticeColor, UINoticeActionAttributes } from './types';
import { Action } from './Action';
import { CountdownCirlce } from './CountdownCircle';

const getBackgroundColor = (color: UINoticeColor, theme: Theme): ColorValue => {
    switch (color) {
        case UINoticeColor.Secondary:
            return theme[ColorVariants.BackgroundSecondary];
        case UINoticeColor.Negative:
            return theme[ColorVariants.StaticBackgroundNegative];
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

export const getActionVariant = (color: UINoticeColor): UIBoxButtonVariant => {
    switch (color) {
        case UINoticeColor.Negative:
            return UIBoxButtonVariant.Negative;
        case UINoticeColor.Secondary:
        case UINoticeColor.PrimaryInverted:
        default:
            return UIBoxButtonVariant.Neutral;
    }
};

const getBorderRadius = (type: UINoticeType): number => {
    switch (type) {
        case UINoticeType.BottomToast:
        case UINoticeType.TopToast:
        default:
            return UILayoutConstant.alertBorderRadius;
    }
};

const renderCountdown = (
    countdownValue: Animated.SharedValue<number>,
    countdownProgress: Animated.SharedValue<number>,
    color: UINoticeColor,
    styles: ViewStyle,
    hasCountdown: boolean | undefined,
): React.ReactElement | null => {
    if (hasCountdown) {
        return (
            <View style={styles}>
                <CountdownCirlce
                    countdownValue={countdownValue}
                    countdownProgress={countdownProgress}
                    color={getTitleColorVariant(color)}
                />
            </View>
        );
    }
    return null;
};

const renderAction = (
    action: UINoticeActionAttributes | undefined,
    color: UINoticeColor,
    styles: ViewStyle,
): React.ReactElement | null => {
    if (!action) {
        return null;
    }
    return (
        <View style={styles}>
            <Action action={action} variant={getActionVariant(color)} />
        </View>
    );
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
    hasCountdown,
}: NoticeProps) => {
    const theme = useTheme();
    const styles = useStyles(color, type, theme);
    return (
        <View style={styles.underlay}>
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={onPress}
                    onLongPress={onLongPress}
                    delayLongPress={UIConstant.longPressDelay}
                    onPressOut={onPressOut}
                >
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                {renderCountdown(
                    countdownValue,
                    countdownProgress,
                    color,
                    styles.countdown,
                    hasCountdown,
                )}
                <View style={styles.labelContainer} pointerEvents="none">
                    <UILabel
                        testID="message_default"
                        role={TypographyVariants.ParagraphNote}
                        color={getTitleColorVariant(color)}
                    >
                        {title}
                    </UILabel>
                </View>
                {renderAction(action, color, styles.action)}
            </View>
        </View>
    );
};

const useStyles = makeStyles((color: UINoticeColor, type: UINoticeType, theme: Theme) => ({
    underlay: {
        maxWidth: UIConstant.maxWidth,
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
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    labelContainer: {
        flex: 1,
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
    },
    countdown: {
        paddingRight: UILayoutConstant.contentInsetVerticalX2,
        zIndex: -10,
    },
    action: {
        marginHorizontal: -UILayoutConstant.contentInsetVerticalX3,
    },
}));
