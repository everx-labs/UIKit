import * as React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle, ImageProps } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { Portal } from './Portal';
import { UIConstant } from './constants';
import { UIImage } from './UIImage';

const minimize = require('../assets/icons/minimize/minimize.png');

type OnFold = () => void | Promise<void>;

export type UIFondingNoticeProps = {
    visible: boolean;
    folded: boolean;
    onFold?: OnFold;
    icon: ImageProps;
    children: React.ReactNode;
    style?: ViewStyle;
};

function UIFoldingNoticePortalContent({
    visible,
    folded,
    onFold,
    icon,
    children,
    style,
}: UIFondingNoticeProps) {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [contentWidth, setContentWidth] = React.useState(0);
    const visibleAnim = React.useRef(new Animated.Value(-containerWidth)).current;
    const foldingAnim = React.useRef(new Animated.Value(0)).current;

    const show = () => {
        Animated.timing(visibleAnim, {
            toValue: (UIConstant.contentOffset * 2),
            useNativeDriver: false,
        }).start();
    };

    const hide = () => {
        Animated.timing(visibleAnim, {
            toValue: -containerWidth - (UIConstant.contentOffset * 2),
            useNativeDriver: false,
        }).start();
    };

    const foldNotice = () => {
        Animated.timing(foldingAnim, {
            toValue: UIConstant.minNoticeSize,
            useNativeDriver: false,
        }).start();
    };

    const unfoldNotice = () => {
        Animated.timing(foldingAnim, {
            toValue: UIConstant.minNoticeSize + contentWidth + UIConstant.contentOffset,
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

    const containerStyle = React.useMemo(
        () => [
            styles.container,
            {
                right: visibleAnim,
            }
        ],
        [],
    );

    const noticeStyle = React.useMemo(
        () => [
            style,
            styles.notice,
            {
                width: foldingAnim,
            },
        ],
        []
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

    return (
        <Animated.View
            style={containerStyle}
            onLayout={onContainerLayout}
        >
            <TapGestureHandler
                enabled={folded}
                onGestureEvent={onFold}
            >
                <Animated.View style={noticeStyle}>
                    <UIImage source={icon} style={styles.noticeIcon} />
                    <View style={styles.content} onLayout={onContentLayout}>
                        {children}
                        <TouchableOpacity onPress={onFold}>
                            <UIImage source={minimize} style={styles.noticeBtn} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TapGestureHandler>
        </Animated.View>
    );
}

export function UIFoldingNotice(props: UIFondingNoticeProps) {
    return (
        <Portal>
            <UIFoldingNoticePortalContent
                {...props}
            />
        <Portal absoluteFill>
        </Portal>
    )
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
    },
    content: {
        flexDirection: 'row',
    },
    noticeIcon: {
        marginRight: UIConstant.contentOffset,
    },
    noticeBtn: {
        marginLeft: UIConstant.contentOffset,
    },
});
