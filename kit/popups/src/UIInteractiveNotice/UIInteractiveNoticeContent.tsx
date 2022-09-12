import * as React from 'react';
import { View, Platform, TouchableWithoutFeedback, StyleSheet, ImageStyle } from 'react-native';
import {
    TypographyVariants,
    UILabel,
    ColorVariants,
    UIBackgroundView,
    UIBackgroundViewColors,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import { UIConstant } from '../constants';
import type { InteractiveNoticeContentProps } from './types';
import { Actions } from './Actions';
import { CloseButton } from './CloseButton';
import { NoticeCountdown } from './NoticeCountdown';

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
}: InteractiveNoticeContentProps) {
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
                    <UIImage source={icon} style={styles.image as ImageStyle} />
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
                <Actions actions={actions} />
            </View>
            <CloseButton
                showCloseButton={showCloseButton}
                style={styles.closeButton}
                onClose={onClose}
            />
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
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
        alignItems: 'flex-start',
        paddingLeft: UILayoutConstant.contentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    centerContainer: {
        flex: 1,
        paddingRight: UILayoutConstant.contentOffset,
        alignSelf: 'center',
    },
    leftContainer: {
        marginRight: UILayoutConstant.contentOffset,
    },
    closeButton: {
        paddingRight: UILayoutConstant.contentOffset,
    },
    image: {
        height: UILayoutConstant.iconSize,
        aspectRatio: 1,
    },
});
