import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UISheet, UISheetProps } from './UISheet/UISheet';
import { useWindowDimensions } from '../useWindowDimensions';

export type UIFullscreenSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIFullscreenSheet({
    children,
    style,
    /**
     * By default UISheet calculate status bar color to be
     * contrast to overlay. Change it to be contrast against
     * primary color, as overlay isn't visible in this sheet.
     */
    statusBarTriggerColor = 'primary',
    ...rest
}: UIFullscreenSheetProps) {
    const { height } = useWindowDimensions();

    const fullscreenHeight = React.useMemo(() => {
        return height + UILayoutConstant.rubberBandEffectDistance;
    }, [height]);

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
                    <UISheet.Content
                        {...rest}
                        style={[styles.bottom, style, sheetStyle]}
                        statusBarTriggerColor={statusBarTriggerColor}
                    >
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
