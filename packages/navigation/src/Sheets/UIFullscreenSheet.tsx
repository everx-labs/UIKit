import * as React from 'react';
import {
    StyleProp,
    StyleSheet,
    ViewStyle,
    View,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '../constants';
import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIFullscreenSheetProps = Omit<
    UISheetProps,
    'countRubberBandDistance'
> & {
    style?: StyleProp<ViewStyle>;
};

export function UIFullscreenSheet({
    children,
    style,
    ...rest
}: UIFullscreenSheetProps) {
    const { height } = useWindowDimensions();
    const { top: topInset } = useSafeAreaInsets();
    const passedPaddingBottom =
        (StyleSheet.flatten(style).paddingBottom as number) ?? 0;

    const sheetStyle = React.useMemo(
        () => ({
            paddingBottom:
                passedPaddingBottom + UIConstant.rubberBandEffectDistance,
        }),
        [passedPaddingBottom],
    );

    const innerStyle = React.useMemo(
        () => ({
            height:
                height -
                Math.max(StatusBar.currentHeight ?? 0, topInset) -
                passedPaddingBottom,
        }),
        [height, topInset, passedPaddingBottom],
    );

    return (
        <UISheet
            {...rest}
            countRubberBandDistance
            style={[styles.bottom, style, sheetStyle]}
        >
            <View style={innerStyle}>{children}</View>
        </UISheet>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
