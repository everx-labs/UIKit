import * as React from 'react';
import { Animated, StyleSheet, View, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { UIAssets } from '@tonlabs/uikit.assets';

import { Portal, UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import { TouchableOpacity, useHover } from '@tonlabs/uikit.controls';
import { UIBackgroundView, UIBackgroundViewColors, ColorVariants } from '@tonlabs/uikit.themes';

import { UIConstant } from '../constants';

const AnimatedWithColor = Animated.createAnimatedComponent(UIBackgroundView);

type OnClose = () => void | Promise<void>;

export type UINoticeCommonProps = {
    visible: boolean;
    icon: ImageSourcePropType;
    children: React.ReactNode;
    onClose?: OnClose;
    testID?: string;
};

export type UIPromoNoticeProps = UINoticeCommonProps & {
    /**
     * Whether to add folding behaviour or to use default notice
     */
    folding?: boolean;
};

function UIFoldingNotice({ visible, icon, children, testID }: UINoticeCommonProps) {
    const [folded, setFolded] = React.useState(false);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [contentWidth, setContentWidth] = React.useState(0);
    const visibleAnim = React.useRef(new Animated.Value(-containerWidth)).current;
    const foldingAnim = React.useRef(new Animated.Value(0)).current;
    const iconPaddingAnim = React.useRef(
        new Animated.Value(UILayoutConstant.normalContentOffset),
    ).current;
    const iconHoverAnim = React.useRef(new Animated.Value(UIConstant.minNoticeIconSize)).current;
    const windowWidth = useWindowDimensions().width;

    const {
        isHovered: isIconHovered,
        onMouseEnter: onIconMouseEnter,
        onMouseLeave: onIconMouseLeave,
    } = useHover();
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const onFold = React.useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    const show = React.useCallback(() => {
        Animated.spring(visibleAnim, {
            toValue: UILayoutConstant.contentOffset * 2,
            useNativeDriver: false,
        }).start();
    }, [visibleAnim]);

    const hide = React.useCallback(() => {
        Animated.spring(visibleAnim, {
            toValue: -containerWidth - UILayoutConstant.contentOffset * 2,
            useNativeDriver: false,
        }).start();
    }, [visibleAnim, containerWidth]);

    const foldNotice = React.useCallback(() => {
        Animated.spring(foldingAnim, {
            toValue: UIConstant.minNoticeSize,
            useNativeDriver: false,
        }).start();
    }, [foldingAnim]);

    const unfoldNotice = React.useCallback(() => {
        Animated.spring(foldingAnim, {
            toValue: UIConstant.minNoticeSize + contentWidth,
            useNativeDriver: false,
        }).start();
    }, [contentWidth, foldingAnim]);

    const foldNoticeIcon = React.useCallback(() => {
        Animated.parallel([
            Animated.timing(iconHoverAnim, {
                toValue: UIConstant.minNoticeIconSize,
                useNativeDriver: false,
                duration: 150,
            }),
            Animated.timing(iconPaddingAnim, {
                toValue: UILayoutConstant.normalContentOffset,
                useNativeDriver: false,
                duration: 150,
            }),
        ]).start();
    }, [iconHoverAnim, iconPaddingAnim]);

    const expandNoticeIcon = React.useCallback(() => {
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
    }, [iconHoverAnim, iconPaddingAnim]);

    React.useEffect(() => {
        if (visible) {
            show();
        } else {
            hide();
        }
    }, [visible, show, hide]);

    // TODO: think whether it should be implemented somehow else
    //  or min screen width should be moved to a prop
    React.useEffect(() => {
        if (windowWidth < UIConstant.minimumWidthToShowFoldingNotice) {
            hide();
        } else {
            show();
        }
    }, [windowWidth, show, hide]);

    React.useEffect(() => {
        if (folded) {
            foldNotice();
        } else {
            unfoldNotice();
        }
    }, [folded, foldNotice, unfoldNotice]);

    React.useEffect(() => {
        if (folded && isIconHovered) {
            expandNoticeIcon();
        } else {
            foldNoticeIcon();
        }
    }, [folded, isIconHovered, foldNoticeIcon, expandNoticeIcon]);

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                right: visibleAnim,
            },
        ],
        [visibleAnim],
    );

    const noticeStyle = React.useMemo(
        () => [
            styles.notice,
            {
                width: foldingAnim,
            },
        ],
        [foldingAnim],
    );

    const noticeIconContainerStyle = React.useMemo(
        () => [
            {
                padding: iconPaddingAnim,
            },
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
        }: LayoutChangeEvent) => {
            setContainerWidth(lWidth);
        },
        [],
    );

    const onContentLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width: lWidth },
            },
        }: LayoutChangeEvent) => {
            setContentWidth(lWidth);
        },
        [],
    );

    return (
        <Animated.View style={containerStyle} onLayout={onContainerLayout}>
            <TapGestureHandler enabled={folded} onGestureEvent={onFold}>
                <AnimatedWithColor color={ColorVariants.BackgroundPrimary} style={noticeStyle}>
                    <Animated.View style={noticeIconContainerStyle}>
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
                    <View style={styles.content} onLayout={onContentLayout} testID={testID}>
                        <View style={styles.contentContainer}>{children}</View>
                        <TouchableOpacity
                            // @ts-expect-error
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onPress={onFold}
                            style={styles.noticeButton}
                        >
                            <UIImage
                                source={UIAssets.icons.ui.buttonMinimize}
                                tintColor={
                                    isHovered ? ColorVariants.TextAccent : ColorVariants.TextPrimary
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </AnimatedWithColor>
            </TapGestureHandler>
        </Animated.View>
    );
}

function UIClosableNotice({ visible, onClose, icon, children, testID }: UINoticeCommonProps) {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const visibleAnim = React.useRef(new Animated.Value(-containerWidth)).current;

    const show = React.useCallback(() => {
        Animated.spring(visibleAnim, {
            toValue: UILayoutConstant.contentOffset * 2,
            useNativeDriver: false,
        }).start();
    }, [visibleAnim]);

    const hide = React.useCallback(() => {
        Animated.spring(visibleAnim, {
            toValue: -containerWidth - UILayoutConstant.contentOffset * 2,
            useNativeDriver: false,
        }).start();
    }, [visibleAnim, containerWidth]);

    React.useEffect(() => {
        if (visible) {
            show();
        } else {
            hide();
        }
    }, [visible, show, hide]);

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                right: visibleAnim,
            },
        ],
        [visibleAnim],
    );

    const onContainerLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width: lWidth },
            },
        }: LayoutChangeEvent) => {
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
        <Animated.View style={containerStyle} onLayout={onContainerLayout}>
            <UIBackgroundView
                color={ColorVariants.BackgroundPrimary}
                style={styles.notice}
                testID={testID}
            >
                <UIBackgroundView
                    color={UIBackgroundViewColors.BackgroundAccent}
                    style={[styles.noticeIcon, styles.closableNoticeIcon]}
                >
                    <UIImage source={icon} />
                </UIBackgroundView>
                <View style={styles.content}>
                    <View style={styles.contentContainer}>{children}</View>
                    <TouchableOpacity onPress={onClosePress} style={styles.noticeButton}>
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

export function UIPromoNotice({ folding = false, ...props }: UIPromoNoticeProps) {
    return (
        <Portal absoluteFill>
            {folding ? <UIFoldingNotice {...props} /> : <UIClosableNotice {...props} />}
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: UILayoutConstant.contentOffset * 2,
        right: UILayoutConstant.contentOffset * 2,
    },
    notice: {
        width: '100%',
        minHeight: UIConstant.minNoticeSize,
        minWidth: UIConstant.minNoticeSize,
        maxWidth: 'auto',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: UILayoutConstant.alertBorderRadius,
        ...UILayoutConstant.cardShadow,
    },
    noticeIcon: {
        borderRadius: UILayoutConstant.alertBorderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    closableNoticeIcon: {
        width: UIConstant.minNoticeIconSize,
        height: UIConstant.minNoticeIconSize,
        marginVertical: UILayoutConstant.contentInsetVerticalX3,
        marginHorizontal: UILayoutConstant.normalContentOffset,
    },
    content: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        flexDirection: 'row',
    },
    contentContainer: {
        paddingHorizontal: UILayoutConstant.tinyContentOffset,
        justifyContent: 'center',
    },
    noticeButton: {
        marginHorizontal: UILayoutConstant.normalContentOffset,
        height: UILayoutConstant.smallCellHeight,
    },
});
