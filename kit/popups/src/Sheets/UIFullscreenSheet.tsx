import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIFullscreenSheetProps = Omit<UISheetProps, 'countRubberBandDistance'> & {
    style?: StyleProp<ViewStyle>;
};

export function UIFullscreenSheet({ children, style, ...rest }: UIFullscreenSheetProps) {
    const { height } = useWindowDimensions();
    const { top: topInset } = useSafeAreaInsets();

    const sheetStyle = React.useMemo(() => {
        const flattenStyle = StyleSheet.flatten(style);
        const paddingBottom =
            Math.max((flattenStyle.paddingBottom as number) ?? 0) +
            UILayoutConstant.rubberBandEffectDistance;

        return {
            paddingBottom,
            height:
                height -
                Math.max(StatusBar.currentHeight ?? 0, topInset) +
                UILayoutConstant.rubberBandEffectDistance,
        };
    }, [style, height, topInset]);

    const { visible, forId } = rest;
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardUnaware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.Content {...rest} style={[styles.bottom, style, sheetStyle]}>
                    {children}
                </UISheet.Content>
            </UISheet.KeyboardUnaware>
        </UISheet.Container>
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
