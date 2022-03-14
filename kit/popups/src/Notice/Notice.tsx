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
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    useTheme,
    Theme,
    makeStyles,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant } from '../constants';
import { NoticeProps, UINoticeColor, UINoticeActionAttributes } from './types';
import { Action } from './Action';
import { CountdownCirlce } from './CountdownCircle';

const getBackgroundColor = (color: UINoticeColor, theme: Theme): ColorValue => {
    switch (color) {
        case UINoticeColor.Secondary:
            return theme[ColorVariants.BackgroundSecondary];
        case UINoticeColor.Negative:
            return theme[ColorVariants.BackgroundNegative];
        case UINoticeColor.Primary:
        default:
            return theme[ColorVariants.BackgroundBW];
    }
};

const renderCountdown = (
    countdownValue: Animated.SharedValue<number>,
    countdownProgress: Animated.SharedValue<number>,
    styles: ViewStyle,
    hasCountdown: boolean | undefined,
): React.ReactElement | null => {
    if (hasCountdown) {
        return (
            <View style={styles}>
                <CountdownCirlce
                    countdownValue={countdownValue}
                    countdownProgress={countdownProgress}
                    color={ColorVariants.TextPrimary}
                />
            </View>
        );
    }
    return null;
};

const renderAction = (
    action: UINoticeActionAttributes | undefined,
    styles: ViewStyle,
): React.ReactElement | null => {
    if (!action) {
        return null;
    }
    return (
        <View style={styles}>
            <Action action={action} />
        </View>
    );
};

export const Notice: React.FC<NoticeProps> = ({
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
    const styles = useStyles(color, theme);
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
                {renderCountdown(countdownValue, countdownProgress, styles.countdown, hasCountdown)}
                <View style={styles.labelContainer} pointerEvents="none">
                    <UILabel
                        testID="message_default"
                        role={TypographyVariants.ParagraphNote}
                        color={ColorVariants.TextPrimary}
                    >
                        {title}
                    </UILabel>
                </View>
                {renderAction(action, styles.action)}
            </View>
        </View>
    );
};

const useStyles = makeStyles((color: UINoticeColor, theme: Theme) => ({
    underlay: {
        maxWidth: UIConstant.maxWidth,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: UILayoutConstant.alertBorderRadius,
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
