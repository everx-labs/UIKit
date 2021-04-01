import * as React from 'react';
import { Animated, ImageProps, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { UIAssets } from '@tonlabs/uikit.assets';

import { ColorVariants } from './Colors';
import { UIConstant } from './constants';
import { UIBackgroundView, UIBackgroundViewColors } from './UIBackgroundView';
import { UIImage } from './UIImage';
import { Portal } from './Portal';
import { useHover } from './useHover';

const AnimatedWithColor = Animated.createAnimatedComponent(UIBackgroundView);

type OnFold = () => void | Promise<void>;
type OnClose = () => void | Promise<void>;

export type UINoticeCommonProps = {
    visible: boolean;
    icon: ImageProps;
    children: React.ReactNode;
    style?: ViewStyle;
};

export type UIFoldingNoticeProps = UINoticeCommonProps & {
    folded?: boolean;
    onFold?: OnFold;
};

export type UIClosableNoticeProps = UINoticeCommonProps & {
    onClose?: OnClose;
};

export type UINoticeProps = UINoticeCommonProps & {
    /**
     * Whether to add folding behaviour or to use default notice
     */
    folding?: boolean;
    folded?: boolean;
    onFold?: OnFold;
    onClose?: OnClose;
};

function UIFoldingNotice({
    visible,
    folded = true,
    onFold,
    icon,
    children,
    style,
}: UIFoldingNoticeProps) {
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

    const onFoldPress = React.useCallback(() => {
        if (onFold) {
            onFold();
        }
    }, [onFold]);

    return (
        <Animated.View
            style={containerStyle}
            onLayout={onContainerLayout}
        >
            <TapGestureHandler
                enabled={folded}
                onGestureEvent={onFoldPress}
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
                        <TouchableOpacity
                            // @ts-expect-error
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onPress={onFoldPress}
                            style={styles.noticeButton}
                        >
                            <UIImage
                                source={UIAssets.icons.ui.buttonMinimize}
                                tintColor={isHovered
                                    ? ColorVariants.TextAccent
                                    : ColorVariants.TextPrimary}
                            />
                        </TouchableOpacity>
                    </View>
                </AnimatedWithColor>
            </TapGestureHandler>
        </Animated.View>
    );
}

function UIClosableNotice({
    visible,
    onClose,
    icon,
    children,
    style,
}: UIClosableNoticeProps) {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const visibleAnim = React.useRef(new Animated.Value(-containerWidth)).current;

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

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                right: visibleAnim,
            }
        ],
        [visibleAnim],
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

    const onClosePress = React.useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Animated.View
            style={containerStyle}
            onLayout={onContainerLayout}
        >
            <UIBackgroundView
                color={ColorVariants.BackgroundPrimary}
                style={[style, styles.notice]}
            >
                <UIBackgroundView
                    color={UIBackgroundViewColors.BackgroundAccent}
                    style={[styles.noticeIcon, styles.closableNoticeIcon]}
                >
                    <UIImage source={icon} />
                </UIBackgroundView>
                <View style={styles.content}>
                    <View style={styles.contentContainer}>
                        {children}
                    </View>
                    <TouchableOpacity
                        onPress={onClosePress}
                        style={styles.noticeButton}
                    >
                        <UIImage
                            source={UIAssets.icons.ui.buttonClose}
                            tintColor={ColorVariants.TextAccent}
                        />
                    </TouchableOpacity>
                </View>
            </UIBackgroundView>
        </Animated.View>
    );
}

export function UINotice({
    folding,
    ...props
}: UINoticeProps) {
    return (
        <Portal absoluteFill>
            {
                folding ? (
                    <UIFoldingNotice {...props} />
                ) : (
                    <UIClosableNotice {...props} />
                )
            }
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
    closableNoticeIcon: {
        width: UIConstant.minNoticeIconSize,
        height: UIConstant.minNoticeIconSize,
        margin: UIConstant.normalContentOffset,
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
