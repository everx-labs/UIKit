import * as React from 'react';
import { useWindowDimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { UIImageProps, Theme } from '@tonlabs/uikit.hydrogen';
import {
    useShadow,
    useTheme,
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelRoles,
    UIImage,
    makeStyles,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';

import type { useNoticeVisibility } from '../Notice/hooks/useNoticeVisibility';

export type UIPushNoticeContentPublicProps = {
    /**
     * A title of a push notification.
     *
     * It shouldn't be a long string, as it has constraint to only one line.
     * It's distint from other text with boldness.
     */
    title: string;
    /**
     * A text below title.
     *
     * Has limitation of 2 lines, but one can put string with any length,
     * as the rest will be ellipsized.
     */
    message: string;
    /**
     * Optional icon source
     */
    icon?: UIImageProps['source'];
    /**
     * Whether notice should have visible countdown or not.
     *
     * `true` by default.
     */
    hasCountdown?: boolean;
};

type ContentPrivateProps = {
    onPress: () => void;
    onLongPress: () => void;
    onPressOut: () => void;
    countdownProgress: ReturnType<typeof useNoticeVisibility>['countdownProgress'];
};

function LineCountdown({
    countdownProgress,
}: {
    countdownProgress: ContentPrivateProps['countdownProgress'];
}) {
    const { width } = useWindowDimensions();

    const noticeWidth = React.useMemo(
        () => width - UIConstant.notice.toastIndentFromScreenEdges * 2,
        [width],
    );

    const countdownStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: countdownProgress.value * noticeWidth * -1,
                },
            ],
        };
    }, [noticeWidth]);

    const theme = useTheme();
    const dynamicStyles = useStyles(theme);
    return (
        <UIBackgroundView
            color={UIBackgroundViewColors.BackgroundTertiary}
            style={styles.countdownContainer}
        >
            <Animated.View style={[dynamicStyles.countdownLine, countdownStyle]} />
        </UIBackgroundView>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    countdownLine: {
        flex: 1,
        backgroundColor: theme[UIBackgroundViewColors.BackgroundPrimaryInverted],
    },
}));

export type UIPushNoticeContentProps = UIPushNoticeContentPublicProps & ContentPrivateProps;

export function UIPushNoticeContent({
    title,
    message,
    icon,
    hasCountdown = true,
    countdownProgress,
    onPress,
    onLongPress,
    onPressOut,
}: UIPushNoticeContentProps) {
    const shadowStyle = useShadow(5);

    return (
        <UIBackgroundView
            color={UIBackgroundViewColors.BackgroundTertiary}
            style={[shadowStyle, styles.wrapper]}
        >
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundTertiary}
                style={[shadowStyle, styles.inner]}
            >
                <TouchableWithoutFeedback
                    onPress={onPress}
                    onLongPress={onLongPress}
                    delayLongPress={UIConstant.notice.longPressDelay}
                    onPressOut={onPressOut}
                >
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                {icon != null && (
                    <View pointerEvents="none">
                        <UIImage source={icon} style={styles.icon} />
                    </View>
                )}
                <UIBackgroundView
                    color={UIBackgroundViewColors.BackgroundTertiary}
                    style={styles.description}
                    pointerEvents="none"
                >
                    <UILabel role={UILabelRoles.HeadlineSubhead} numberOfLines={1}>
                        {title}
                    </UILabel>
                    <UILabel role={UILabelRoles.ParagraphNote} numberOfLines={2}>
                        {message}
                    </UILabel>
                </UIBackgroundView>
                {hasCountdown && <LineCountdown countdownProgress={countdownProgress} />}
            </UIBackgroundView>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        maxWidth: UIConstant.notice.maxWidth,
        flex: 1,
        borderRadius: UIConstant.alertBorderRadius,
    },
    inner: {
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        padding: UIConstant.contentOffset,
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
    },
    icon: {
        height: UIConstant.iconPushSize,
        width: UIConstant.iconPushSize,
        marginRight: UIConstant.contentInsetVerticalX3,
    },
    description: { flex: 1 },
    countdownContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
    },
});
