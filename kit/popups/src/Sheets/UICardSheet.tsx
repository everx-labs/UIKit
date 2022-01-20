import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UICardSheetProps = UISheetProps & { style?: StyleProp<ViewStyle> };

// @inline
const CARD_SHEET_DEFAULT_BOTTOM_INSET = 16; // UILayoutConstant.contentOffset

function getCardSheetBottomInset(bottomInset: number, keyboardHeight: number) {
    'worklet';

    if (keyboardHeight !== 0) {
        return CARD_SHEET_DEFAULT_BOTTOM_INSET;
    }

    return Math.max(CARD_SHEET_DEFAULT_BOTTOM_INSET, bottomInset);
}

export function UICardSheet({ children, style, ...rest }: UICardSheetProps) {
    const { visible, forId } = rest;
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware getBottomInset={getCardSheetBottomInset}>
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} style={styles.card}>
                        <View style={[style, styles.cardInner]}>{children}</View>
                    </UISheet.Content>
                </UISheet.IntrinsicSize>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: UILayoutConstant.elasticWidthCardSheet,
        alignSelf: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    cardInner: {
        width: '100%',
    },
});
