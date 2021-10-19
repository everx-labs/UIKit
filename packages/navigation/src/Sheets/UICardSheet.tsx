import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native';
import { UIConstant } from '../constants';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UICardSheetProps = UISheetProps & { style?: StyleProp<ViewStyle> };

export function UICardSheet({ children, style, ...rest }: UICardSheetProps) {
    return (
        <UISheet {...rest} style={[styles.card]}>
            <View style={[style, styles.cardInner]}>{children}</View>
        </UISheet>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: UIConstant.elasticWidthCardSheet,
        alignSelf: 'center',
        paddingHorizontal: UIConstant.contentOffset,
    },
    cardInner: {
        width: '100%',
    },
});
