import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UICardSheetProps = UISheetProps & { style?: StyleProp<ViewStyle> };

export function UICardSheet({ children, style, ...rest }: UICardSheetProps) {
    const { bottom } = useSafeAreaInsets();
    return (
        <UISheet
            {...rest}
            style={[
                styles.card,
                {
                    paddingBottom: Math.max(bottom, UILayoutConstant.contentOffset),
                },
            ]}
        >
            <View style={[style, styles.cardInner]}>{children}</View>
        </UISheet>
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
