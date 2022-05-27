import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { BubbleBaseT } from './types';
import { useBubblePosition, useBubbleContainerStyle } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';

type BubbleProps = BubbleBaseT & { children: React.ReactNode; style: StyleProp<ViewStyle> };

export function Bubble(props: BubbleProps) {
    const { status, onLayout, children, style } = props;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(props);
    const bubbleBackgroundColor = useBubbleBackgroundColor(props);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(props, position);

    return (
        <View style={[containerStyle, styles.container]} onLayout={onLayout}>
            <View style={[styles.content, bubbleBackgroundColor, roundedCornerStyle, style]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
    },
    content: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
});
