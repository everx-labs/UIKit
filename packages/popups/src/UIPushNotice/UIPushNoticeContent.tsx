import * as React from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { UIImageProps } from '@tonlabs/uikit.hydrogen';
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
    title: string;
    message: string;
    icon?: UIImageProps['source'];
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
        <UIBackgroundView style={styles.countdownContainer}>
            <Animated.View style={[dynamicStyles.countdownLine, countdownStyle]}></Animated.View>
        </UIBackgroundView>
    );
}

const useStyles = makeStyles((theme: ReturnType<typeof useTheme>) => ({
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
    countdownProgress,
}: UIPushNoticeContentProps) {
    const shadowStyle = useShadow(5);

    return (
        <UIBackgroundView style={[shadowStyle, styles.wrapper]}>
            <UIBackgroundView style={[shadowStyle, styles.inner]}>
                {icon != null && <UIImage source={icon} style={styles.icon} />}
                <UIBackgroundView style={styles.description}>
                    <UILabel role={UILabelRoles.HeadlineSubhead} numberOfLines={1}>
                        {title}
                    </UILabel>
                    <UILabel role={UILabelRoles.ParagraphNote} numberOfLines={2}>
                        {message}
                    </UILabel>
                </UIBackgroundView>
                <LineCountdown countdownProgress={countdownProgress} />
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
