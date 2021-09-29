import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { UIConstant } from '../constants';
import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
};

export function UIBottomSheet({ children, style, ...rest }: UIBottomSheetProps) {
    return (
        <UISheet {...rest} countRubberBandDistance style={[styles.bottom, style]}>
            {children}
        </UISheet>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        borderTopLeftRadius: UIConstant.borderRadius,
        borderTopRightRadius: UIConstant.borderRadius,
        overflow: 'hidden',
    },
});
