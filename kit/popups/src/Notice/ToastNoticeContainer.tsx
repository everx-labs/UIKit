import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useHover } from '@tonlabs/uikit.controls';
import { useAnimatedKeyboardHeight } from '@tonlabs/uicast.keyboard';

import { UIConstant } from '../constants';
import type { SnapPoints, ToastNoticeProps } from './types';
import { useNoticeHeight } from './hooks/useNoticeHeight';
import {
    useToastNoticeXSnapPoints,
    useNoticePosition,
    useToastNoticeYSnapPoints,
} from './toastNoticeHooks';

export function ToastNoticeContainer({
    type,
    visible,
    onTap,
    onCloseAnimationEnd,
    suspendClosingTimer,
    continueClosingTimer,
    children,
}: ToastNoticeProps) {
    const keyboardHeight = useAnimatedKeyboardHeight();

    const { noticeHeight, onLayoutNotice } = useNoticeHeight();

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const xSnapPoints: SnapPoints = useToastNoticeXSnapPoints();
    const ySnapPoints: SnapPoints = useToastNoticeYSnapPoints(type, noticeHeight, keyboardHeight);

    const { noticePositionStyle, gestureHandler, ...handlers } = useNoticePosition(
        noticeHeight,
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
        <View style={styles.container} pointerEvents="box-none">
            <View style={styles.content} pointerEvents="box-none">
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View
                        style={[noticePositionStyle, styles.notice]}
                        onLayout={onLayoutNotice}
                        // @ts-expect-error
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {children(handlers)}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: UIConstant.toastIndentFromScreenEdges,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        maxWidth: UIConstant.maxWidth,
    },
    notice: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
});
