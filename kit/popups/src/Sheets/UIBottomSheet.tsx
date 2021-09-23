import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIBottomSheet({ children, style, ...rest }: UIBottomSheetProps) {
    return (
        <UISheet
            {...rest}
            countRubberBandDistance
            style={[
                styles.bottom,
                style,
                {
                    paddingBottom:
                        ((StyleSheet.flatten(style).paddingBottom as number) ?? 0) +
                        UILayoutConstant.rubberBandEffectDistance,
                },
            ]}
        >
            {children}
        </UISheet>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        maxWidth: UILayoutConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
