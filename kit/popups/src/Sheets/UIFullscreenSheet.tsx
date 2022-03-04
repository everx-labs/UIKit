import * as React from 'react';
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useDimensions } from '@tonlabs/uikit.inputs';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIFullscreenSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIFullscreenSheet({ children, style, ...rest }: UIFullscreenSheetProps) {
    const {
        screen: { height: screenHeight },
        window: { height: windowHeight },
    } = useDimensions();

    const fullscreenHeight = React.useMemo(() => {
        /**
         * On different platforms it behave differently.
         *
         * On web `screenHeight` is equal to a device screen height
         * a browser window is usually smaller (and can be resized).
         */
        if (Platform.OS === 'web') {
            return windowHeight + UILayoutConstant.rubberBandEffectDistance;
        }

        /**
         * On iOS it seems `windowHeight` is equal to screenHeight.
         *
         * On Android `windowHeight` doesn't include a status bar height and
         * a navigation bar (the one on the bottom). Since we use edge-to-edge
         * right now we want to use `screenHeight` to be fullscreen.
         */
        return screenHeight + UILayoutConstant.rubberBandEffectDistance;
    }, [screenHeight, windowHeight]);

    const sheetStyle = React.useMemo(() => {
        const flattenStyle = StyleSheet.flatten(style);
        const paddingBottom =
            Math.max((flattenStyle.paddingBottom as number) ?? 0) +
            UILayoutConstant.rubberBandEffectDistance;

        return {
            paddingBottom,
            height: fullscreenHeight,
        };
    }, [style, fullscreenHeight]);

    const { visible, forId } = rest;
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardUnaware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.FixedSize height={fullscreenHeight}>
                    <UISheet.Content {...rest} style={[styles.bottom, style, sheetStyle]}>
                        {children}
                    </UISheet.Content>
                </UISheet.FixedSize>
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
        overflow: 'hidden',
    },
});
