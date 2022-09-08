import * as React from 'react';
import { View, Platform, TouchableWithoutFeedback, StyleSheet, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    makeStyles,
    UIBackgroundView,
    UIBackgroundViewColors,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant } from '../constants';
import type { InteractiveNoticeProps, UINoticeActionAttributes } from './types';
import { Action } from './Action';
import { CountdownCirlce } from '../Notice/CountdownCircle';

function NoticeCountdown({
    countdownProgress,
    style,
    hasCountdown,
}: {
    countdownProgress: Animated.SharedValue<number>;
    style: ViewStyle;
    hasCountdown: boolean | undefined;
}): React.ReactElement | null {
    if (hasCountdown) {
        return (
            <View style={style}>
                <CountdownCirlce
                    countdownProgress={countdownProgress}
                    color={ColorVariants.TextPrimary}
                    strokeWidth={UIConstant.interactiveNotice.countdownCircleStrokeWidth}
                />
            </View>
        );
    }
    return null;
}

function NoticeAction({
    action,
    style,
}: {
    action: UINoticeActionAttributes | undefined;
    style: ViewStyle;
}): React.ReactElement | null {
    if (!action) {
        return null;
    }
    return (
        <View style={style}>
            <Action action={action} />
        </View>
    );
}

export function UIInteractiveNoticeContent({
    title,
    onPress,
    onLongPress,
    onPressOut,
    action,
    countdownProgress,
    hasCountdown,
}: InteractiveNoticeProps) {
    const styles = useStyles();
    return (
        <UIBackgroundView
            color={UIBackgroundViewColors.BackgroundSecondary}
            style={styles.underlay}
        >
            {/* <View style={styles.container}> */}
            <TouchableWithoutFeedback
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={UIConstant.longPressDelay}
                onPressOut={onPressOut}
            >
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            <NoticeCountdown
                countdownProgress={countdownProgress}
                style={styles.countdown}
                hasCountdown={hasCountdown}
            />
            <View style={styles.labelContainer} pointerEvents="none">
                <UILabel
                    testID="message_default"
                    role={TypographyVariants.ParagraphNote}
                    color={ColorVariants.TextPrimary}
                >
                    {title}
                </UILabel>
            </View>
            <NoticeAction action={action} style={styles.action} />
            {/* </View> */}
        </UIBackgroundView>
    );
}

const useStyles = makeStyles(() => ({
    underlay: {
        maxWidth: UIConstant.maxWidth,
        flex: 1,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    container: {},
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
