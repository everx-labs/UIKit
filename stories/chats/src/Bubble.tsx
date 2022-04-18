import * as React from 'react';
import { View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles } from '@tonlabs/uikit.themes';
import type { BubbleBaseT } from './types';
import { useBubblePosition, useBubbleContainerStyle } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';

type BubbleProps = BubbleBaseT & { children: React.ReactNode; flexible?: boolean };

export function Bubble(props: BubbleProps) {
    const { status, onLayout, children, flexible = true } = props;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(props);
    const bubbleBackgroundColor = useBubbleBackgroundColor(props);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(props, position);

    const styles = useStyle(flexible);

    return (
        <View style={[containerStyle, styles.container]} onLayout={onLayout}>
            <View style={[styles.content, bubbleBackgroundColor, roundedCornerStyle]}>
                {children}
            </View>
        </View>
    );
}

const useStyle = makeStyles((flexible: boolean) => ({
    container: {
        alignSelf: 'stretch',
    },
    content: {
        alignSelf: flexible ? 'flex-start' : 'stretch',
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
}));
