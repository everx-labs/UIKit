import * as React from 'react';
import { Animated, ImageProps, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { UIAssets } from '@tonlabs/uikit.assets';

import { ColorVariants } from './Colors';
import { UIConstant } from './constants';
import { UIBackgroundView } from './UIBackgroundView';
import { UIImage } from './UIImage';
import { Portal } from './Portal';
import { useHover } from './useHover';

const AnimatedWithColor = Animated.createAnimatedComponent(UIBackgroundView);

type OnFold = () => void | Promise<void>;
type OnClose = () => void | Promise<void>;

export type UIFondingNoticeProps = {
    visible: boolean;
    closable: boolean;
    folded: boolean;
    onClose?: OnClose;
    onFold?: OnFold;
    icon: ImageProps;
    children: React.ReactNode;
    style?: ViewStyle;
};

function UIFoldingNoticePortalContent({
    visible,
    closable,
    folded,
    onClose,
    onFold,
    icon,
    children,
    style,
}: UIFondingNoticeProps) {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [contentWidth, setContentWidth] = React.useState(0);
    const visibleAnim = React.useRef(new Animated.Value(-containerWidth)).current;
    const foldingAnim = React.useRef(new Animated.Value(0)).current;
    const iconPaddingAnim = React.useRef(new Animated.Value(UIConstant.normalContentOffset)).current;
    const iconHoverAnim = React.useRef(new Animated.Value(UIConstant.minNoticeIconSize)).current;

    const {
        isHovered: isIconHovered,
        onMouseEnter: onIconMouseEnter,
        onMouseLeave: onIconMouseLeave,
    } = useHover();
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const show = () => {
        Animated.spring(visibleAnim, {
            toValue: (UIConstant.contentOffset * 2),
            useNativeDriver: false,
        }).start();
    };

    const hide = () => {
        Animated.spring(visibleAnim, {
            toValue: -containerWidth - (UIConstant.contentOffset * 2),
            useNativeDriver: false,
        }).start();
    };

    const foldNotice = () => {
        Animated.spring(foldingAnim, {
            toValue: UIConstant.minNoticeSize,
            useNativeDriver: false,
        }).start();
    };

    const unfoldNotice = () => {
        Animated.spring(foldingAnim, {
            toValue: UIConstant.minNoticeSize + contentWidth,
            useNativeDriver: false,
        }).start();
    };

    const foldNoticeIcon = () => {
        Animated.parallel([
            Animated.timing(iconHoverAnim, {
                toValue: UIConstant.minNoticeIconSize,
                useNativeDriver: false,
                duration: 150,
            }),
            Animated.timing(iconPaddingAnim, {
                toValue: UIConstant.normalContentOffset,
                useNativeDriver: false,
                duration: 150,
            }),
        ]).start();
    };

    const expandNoticeIcon = () => {
        Animated.parallel([
            Animated.timing(iconHoverAnim, {
                toValue: UIConstant.maxNoticeIconSize,
                useNativeDriver: false,
                duration: 150,
            }),
            Animated.timing(iconPaddingAnim, {
                toValue: 0,
                useNativeDriver: false,
                duration: 150,
            }),
        ]).start();
    };

    React.useEffect(
        () => {
            if (visible) {
                show();
            } else {
                hide();
            }
        },
        [visible, containerWidth],
    );

    React.useEffect(
        () => {
            if (folded) {
                foldNotice();
            } else {
                unfoldNotice();
            }
        },
        [folded, contentWidth],
    );

    React.useEffect(
        () => {
            if (folded && isIconHovered) {
                expandNoticeIcon();
            } else {
                foldNoticeIcon();
            }
        },
        [folded, isIconHovered, foldNoticeIcon, expandNoticeIcon],
    );

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                right: visibleAnim,
            }
        ],
        [visibleAnim],
    );

    const noticeStyle = React.useMemo(
        () => [
            style,
            styles.notice,
            {
                width: foldingAnim,
            },
        ],
        [style, foldingAnim]
    );

    const noticeIconContainerStyle = React.useMemo(
        () => [
            {
                padding: iconPaddingAnim,
            }
        ],
        [iconPaddingAnim],
    );

    const noticeIconStyle = React.useMemo(
        () => [
            styles.noticeIcon,
            {
                width: iconHoverAnim,
                height: iconHoverAnim,
            },
        ],
        [iconHoverAnim],
    );

    const onContainerLayout = React.useCallback(
        ({
             nativeEvent: {
                 layout: { width: lWidth },
             },
         }) => {
            setContainerWidth(lWidth);
        },
        [],
    );

    const onContentLayout = React.useCallback(
        ({
             nativeEvent: {
                 layout: { width: lWidth },
             },
         }) => {
            setContentWidth(lWidth);
        },
        [],
    );

    const onNoticeButtonPress = React.useCallback(
        () => {
            if (closable) {
                if (onClose) {
                    onClose();
                }
            } else if (onFold) {
                onFold();
            }
        },
        [closable, onClose, onFold],
    );

    return (
        <Animated.View
            style={containerStyle}
            onLayout={onContainerLayout}
        >
            <TapGestureHandler
                enabled={folded}
                onGestureEvent={onFold}
            >
                <AnimatedWithColor
                    color={ColorVariants.BackgroundPrimary}
                    style={noticeStyle}
                >
                    <Animated.View
                        style={noticeIconContainerStyle}
                    >
                        <AnimatedWithColor
                            // @ts-expect-error
                            onMouseEnter={onIconMouseEnter}
                            onMouseLeave={onIconMouseLeave}
                            color={ColorVariants.BackgroundAccent}
                            style={noticeIconStyle}
                        >
                            <UIImage source={icon} />
                        </AnimatedWithColor>
                    </Animated.View>
                    <View style={styles.content} onLayout={onContentLayout}>
                        <View style={styles.contentContainer}>
                            {children}
                        </View>
                        {closable ? (
                            <TouchableOpacity
                                onPress={onNoticeButtonPress}
                                style={styles.noticeButton}
                            >
                                <UIImage
                                    source={UIAssets.icons.ui.buttonClose}
                                    tintColor={ColorVariants.TextAccent}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                // @ts-expect-error
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                onPress={onNoticeButtonPress}
                                style={styles.noticeButton}
                            >
                                <UIImage
                                    source={UIAssets.icons.ui.buttonMinimize}
                                    tintColor={isHovered
                                        ? ColorVariants.TextAccent
                                        : ColorVariants.TextPrimary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </AnimatedWithColor>
            </TapGestureHandler>
        </Animated.View>
    );
}

export function UIFoldingNotice(props: UIFondingNoticeProps) {
    return (
        <Portal absoluteFill>
            <UIFoldingNoticePortalContent {...props} />
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: UIConstant.contentOffset * 2,
        right: UIConstant.contentOffset * 2,
    },
    notice: {
        width: '100%',
        minHeight: UIConstant.minNoticeSize,
        minWidth: UIConstant.minNoticeSize,
        maxWidth: 'auto',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: UIConstant.alertBorderRadius,
        ...UIConstant.cardShadow,
    },
    noticeIcon: {
        borderRadius: UIConstant.alertBorderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingVertical: UIConstant.normalContentOffset,
        flexDirection: 'row',
    },
    contentContainer: {
        paddingHorizontal: UIConstant.tinyContentOffset,
        justifyContent: 'center',
    },
    noticeButton: {
        marginHorizontal: UIConstant.normalContentOffset,
        height: UIConstant.smallCellHeight,
    },
});
