import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    PanGestureHandler,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useHover, Portal } from '@tonlabs/uikit.hydrogen';
import type { SnapPoints, ToastNoticeProps } from './types';
import { Notice } from './Notice';
import { useNoticeHeight } from './hooks/useNoticeHeight';
import { useNoticePosition } from './toastNoticeHooks/useNoticePosition';
import { UIConstant } from '../constants';
import { useBottomToastNoticeYSnapPoints } from './toastNoticeHooks/useBottomToastNoticeYSnapPoints';
import { useBottomToastNoticeXSnapPoints } from './toastNoticeHooks/useBottomToastNoticeXSnapPoints';

const DELAY_LONG_PRESS = 200;

export const BottomToastNotice: React.FC<ToastNoticeProps> = ({
    type,
    color,
    visible,
    title,
    onTap,
    onCloseAnimationEnd,
    suspendClosingTimer,
    continueClosingTimer,
    keyboardHeight,
    testID,
}: ToastNoticeProps) => {
    const { noticeHeight, onLayoutNotice } = useNoticeHeight();

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const xSnapPoints: SnapPoints = useBottomToastNoticeXSnapPoints();
    const ySnapPoints: SnapPoints = useBottomToastNoticeYSnapPoints(
        noticeHeight,
        keyboardHeight,
    );

    const {
        noticePositionStyle,
        gestureHandler,
        onPress,
        onLongPress,
        onPressOut,
    } = useNoticePosition(
        xSnapPoints,
        ySnapPoints,
        visible,
        isHovered,
        onCloseAnimationEnd,
        suspendClosingTimer,
        continueClosingTimer,
        onTap,
    );

    return (
        <Portal absoluteFill>
            <View style={styles.container} pointerEvents="box-none">
                <Animated.View>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View
                            style={[noticePositionStyle, styles.notice]}
                            onLayout={onLayoutNotice}
                            pointerEvents="box-none"
                            // @ts-expect-error
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <TouchableWithoutFeedback
                                onPress={onPress}
                                onLongPress={onLongPress}
                                delayLongPress={DELAY_LONG_PRESS}
                                onPressOut={onPressOut}
                            >
                                <Notice
                                    type={type}
                                    title={title}
                                    color={color}
                                    testID={testID}
                                />
                            </TouchableWithoutFeedback>
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    notice: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: UIConstant.notice.toastIndentFromScreenEdges,
    },
});
