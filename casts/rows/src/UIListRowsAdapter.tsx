import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { UILink } from './UILink';
import { UICurrencyRow } from './UICurrencyRow';
import { UIAccountRow } from './UIAccountRow';
import { UIListRow, UIListRowKind } from './types';

export function renderUIListItem<ItemT extends UIListRow<any>>({
    item,
}: ListRenderItemInfo<ItemT>) {
    const payload = 'payload' in item ? item.payload : undefined;
    if (item.kind === UIListRowKind.Account) {
        return <UIAccountRow {...item.props} />;
    }
    if (item.kind === UIListRowKind.Link) {
        return <UILink {...item.props} />;
    }
    if (item.kind === UIListRowKind.Currency) {
        return <UICurrencyRow {...item.props} payload={payload} />;
    }
    return null;
}

export const UIListSeparator = React.memo(function UIListSeparator() {
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
});

const styles = StyleSheet.create({
    separator: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
