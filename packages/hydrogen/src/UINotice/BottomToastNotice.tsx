import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { Portal } from '@tonlabs/uikit.hydrogen';
import type { ToastNoticeProps } from './types';
import { Notice } from './Notice';
import { useNoticeHeight } from './hooks/useNoticeHeight';
import { useNoticePositionStyle } from './toastNoticeHooks/useNoticePositionStyle';
import { UIConstant } from '../constants';

export const BottomToastNotice: React.FC<ToastNoticeProps> = ({
    type,
    color,
    visible,
    title,
    onTap,
    onCloseAnimationEnd,
    testID,
}: ToastNoticeProps) => {
    const { noticeHeight, onLayoutNotice } = useNoticeHeight();

    const { noticePositionStyle, gestureHandler } = useNoticePositionStyle(
        noticeHeight,
        visible,
        onCloseAnimationEnd,
    );

    return (
        <Portal absoluteFill>
            <View style={styles.container}>
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View
                        style={[noticePositionStyle, styles.notice]}
                        onLayout={onLayoutNotice}
                    >
                        <Notice
                            type={type}
                            title={title}
                            color={color}
                            onTap={onTap}
                            testID={testID}
                        />
                    </Animated.View>
                </PanGestureHandler>
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
        paddingHorizontal: UIConstant.toastIndentFromScreenEdges,
    },
});
