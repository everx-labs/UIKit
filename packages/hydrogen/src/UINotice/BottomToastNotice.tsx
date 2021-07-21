import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { Portal } from '@tonlabs/uikit.hydrogen';
import type { UINoticeProps } from './types';
import { Notice } from './Notice';
import { useNoticeHeight } from './hooks/useNoticeHeight';
import { useNoticePositionStyle } from './toastNoticeHooks/useNoticePositionStyle';

export const BottomToastNotice: React.FC<UINoticeProps> = ({
    type,
    color,
    visible,
    title,
    onTap,
    onClose,
    testID,
}: UINoticeProps) => {
    const { noticeHeight, onLayoutNotice } = useNoticeHeight();

    const { noticePositionStyle, gestureHandler } = useNoticePositionStyle(
        noticeHeight,
        visible,
        onClose,
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
        left: 40,
        right: 40,
        alignItems: 'center',
    },
    notice: {
        position: 'absolute',
    },
});
