import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { UIAccountRow } from './UIAccountRow';
import { UICurrencyRow } from './UICurrencyRow';
import { UILink } from './UILink';
import { UITableRow } from './UITableRow';

import { UIKitListRow, UIKitListRowKind } from './types';
import type { UIListRow } from './types';

export function renderUIListItem<ItemT extends UIKitListRow<any>>({
    item,
}: ListRenderItemInfo<ItemT>) {
    const payload = 'payload' in item ? item.payload : undefined;
    if (item.kind === UIKitListRowKind.Account) {
        return <UIAccountRow {...item.props} />;
    }
    if (item.kind === UIKitListRowKind.Currency) {
        return <UICurrencyRow {...item.props} payload={payload} />;
    }
    if (item.kind === UIKitListRowKind.Link) {
        return <UILink {...item.props} />;
    }
    if (item.kind === UIKitListRowKind.Table) {
        return <UITableRow {...item.props} />;
    }
    return null;
}

export function createUIListItemRenderer<ItemT extends UIListRow<any, any, any>>(
    customRenderer: ({ item }: ListRenderItemInfo<ItemT>) => React.ReactElement | null,
) {
    return function renderer(itemInfo: ListRenderItemInfo<ItemT>) {
        const row = renderUIListItem(itemInfo);

        if (row != null) {
            return row;
        }

        return customRenderer(itemInfo);
    };
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
