import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { UILink } from './UILink';
import { UICurrencyRow } from './UICurrencyRow';
import { UIListRow, UIListRowKind } from './types';

export function renderUIListItem<P, ItemT extends UIListRow<P>>({
    item,
}: ListRenderItemInfo<ItemT>) {
    const payload = 'payload' in item ? item.payload : undefined;
    if (item.kind === UIListRowKind.Link) {
        return <UILink {...item.props} />;
    }
    if (item.kind === UIListRowKind.Currency) {
        return <UICurrencyRow {...item.props} payload={payload} />;
    }
    return null;
}

export function UIListSeparator() {
    const theme = useTheme();
    return (
        <View
            style={[
                {
                    borderTopColor: theme[ColorVariants.LineOverlayLight],
                },
                styles.separator,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    separator: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
