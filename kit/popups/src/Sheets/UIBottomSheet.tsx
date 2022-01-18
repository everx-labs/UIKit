import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIBottomSheet({ children, style, ...rest }: UIBottomSheetProps) {
    const { visible, forId } = rest;

    const { bottom: bottomInset } = useSafeAreaInsets();

    const sheetStyle = React.useMemo(() => {
        const flattenStyle = StyleSheet.flatten(style);

        return {
            paddingBottom:
                Math.max(bottomInset || 0, (flattenStyle.paddingBottom as number) ?? 0) +
                UILayoutConstant.rubberBandEffectDistance,
        };
    }, [style, bottomInset]);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.Content {...rest} style={[styles.bottom, style, sheetStyle]}>
                    {children}
                </UISheet.Content>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        maxWidth: UILayoutConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        borderTopLeftRadius: UILayoutConstant.alertBorderRadius,
        borderTopRightRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
    },
});
