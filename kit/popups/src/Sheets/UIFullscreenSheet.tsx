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

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIFullscreenSheetProps = Omit<UISheetProps, 'countRubberBandDistance'> & {
    style?: StyleProp<ViewStyle>;
};

export function UIFullscreenSheet({ children, style, ...rest }: UIFullscreenSheetProps) {
    const { height } = useWindowDimensions();
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
    const flattenStyle = StyleSheet.flatten(style);

    const passedPaddingBottom = Math.max(
        bottomInset || 0,
        (flattenStyle.paddingBottom as number) ?? (flattenStyle.padding as number) ?? 0,
    );
    const passedPaddingTop =
        (flattenStyle.paddingTop as number) ?? (flattenStyle.padding as number) ?? 0;

    const sheetStyle = React.useMemo(
        () => ({
            paddingBottom: passedPaddingBottom + UILayoutConstant.rubberBandEffectDistance,
        }),
        [passedPaddingBottom],
    );

    const innerStyle = React.useMemo(
        () => ({
            height:
                height -
                Math.max(StatusBar.currentHeight ?? 0, topInset) -
                passedPaddingBottom -
                passedPaddingTop,
        }),
        [height, topInset, passedPaddingBottom, passedPaddingTop],
    );

    return (
        <UISheet {...rest} countRubberBandDistance style={[styles.bottom, style, sheetStyle]}>
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
