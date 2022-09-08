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
import { UIImage } from '@tonlabs/uikit.media';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '../constants';
import type { InteractiveNoticeProps, UIInteractiveNoticeAction } from './types';
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
            <View
                style={[
                    {
                        height: UILayoutConstant.iconSize,
                        width: UILayoutConstant.iconSize,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    style,
                ]}
            >
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

function Action({ title, onTap }: UIInteractiveNoticeAction) {
    return (
        <UIPressableArea
            style={{
                paddingHorizontal: UILayoutConstant.contentOffset / 2,
                paddingVertical: UILayoutConstant.contentInsetVerticalX2,
            }}
            onPress={onTap}
        >
            <UILabel testID="uiNotice_action" role={TypographyVariants.SurfActionSpecial}>
                {title}
            </UILabel>
        </UIPressableArea>
    );
}

function Actions({
    actions,
    style,
}: Pick<InteractiveNoticeProps, 'actions'> & {
    style: ViewStyle;
}): React.ReactElement | null {
    const actionList = React.useMemo(() => {
        if (!actions) {
            return [];
        }
        if (Array.isArray(actions)) {
            return actions;
        }
        return [actions];
    }, [actions]);

    if (actionList.length === 0) {
        return null;
    }
    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: UILayoutConstant.contentInsetVerticalX1,
                    marginHorizontal: -UILayoutConstant.contentOffset / 2,
                    marginBottom: -UILayoutConstant.contentInsetVerticalX2,
                },
                style,
            ]}
        >
            {actionList.map(Action)}
        </View>
    );
}

function CloseButton({
    style,
    showCloseButton,
    onClose,
}: Pick<InteractiveNoticeProps, 'showCloseButton' | 'onClose'> & { style: ViewStyle }) {
    if (!showCloseButton) {
        return null;
    }
    return (
        <View style={style}>
            <UIPressableArea
                onPress={onClose}
                style={{
                    marginVertical: -UILayoutConstant.contentInsetVerticalX4,
                    marginHorizontal: -UILayoutConstant.contentOffset,
                    paddingVertical: UILayoutConstant.contentInsetVerticalX4,
                    paddingHorizontal: UILayoutConstant.contentOffset,
                }}
            >
                <UIImage
                    source={UIAssets.icons.ui.closeBlack}
                    tintColor={ColorVariants.GraphSecondary}
                    style={{
                        height: UILayoutConstant.iconSize,
                        aspectRatio: 1,
                    }}
                />
            </UIPressableArea>
        </View>
    );
}

export function UIInteractiveNoticeContent({
    title,
    onPress,
    onLongPress,
    onPressOut,
    onClose,
    icon,
    actions,
    showCloseButton,
    countdownProgress,
    hasCountdown,
}: InteractiveNoticeProps) {
    const styles = useStyles();
    return (
        <UIBackgroundView
            color={UIBackgroundViewColors.BackgroundSecondary}
            style={styles.underlay}
        >
            <TouchableWithoutFeedback
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={UIConstant.longPressDelay}
                onPressOut={onPressOut}
            >
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            {icon ? (
                <View style={styles.leftContainer}>
                    <UIImage
                        source={icon}
                        style={{ height: UILayoutConstant.iconSize, aspectRatio: 1 }}
                    />
                </View>
            ) : (
                <NoticeCountdown
                    countdownProgress={countdownProgress}
                    style={styles.leftContainer}
                    hasCountdown={hasCountdown}
                />
            )}
            <View style={styles.centerContainer} pointerEvents="box-none">
                <View pointerEvents="none">
                    <UILabel
                        testID="message_default"
                        role={TypographyVariants.ParagraphNote}
                        color={ColorVariants.TextPrimary}
                    >
                        {title}
                    </UILabel>
                </View>
                <Actions actions={actions} style={{}} />
            </View>
            <CloseButton
                showCloseButton={showCloseButton}
                style={styles.closeButton}
                onClose={onClose}
            />
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
        paddingLeft: UILayoutConstant.contentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    centerContainer: {
        flex: 1,
        paddingRight: UILayoutConstant.contentOffset,
    },
    leftContainer: {
        marginRight: UILayoutConstant.contentOffset,
    },
    closeButton: {
        paddingRight: UILayoutConstant.contentOffset,
        alignSelf: 'flex-start',
    },
}));
