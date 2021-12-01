import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

import { UILink, UILinkProps } from './UILink';
import { UICurrencyRow, UICurrencyRowProps } from './UICurrencyRow';
import { UIAccountRow, UIAccountRowProps } from './UIAccountRow';

export enum UIListRowKind {
    Account = 'account',
    Link = 'link',
    Currency = 'currency',
}

type LinkRow = {
    kind: UIListRowKind.Link;
    props: UILinkProps;
};
type CurrencyRow = {
    kind: UIListRowKind.Currency;
    props: UICurrencyRowProps;
};
type AccountRow = {
    kind: UIListRowKind.Account;
    props: UIAccountRowProps;
};

export type UIListRow = LinkRow | CurrencyRow | AccountRow;
export type UIListRows = UIListRow[];

export function renderUIListItem<ItemT extends UIListRow>({ item }: ListRenderItemInfo<ItemT>) {
    if (item.kind === UIListRowKind.Account) {
        return <UIAccountRow {...item.props} />;
    }
    if (item.kind === UIListRowKind.Link) {
        return <UILink {...item.props} />;
    }
    if (item.kind === UIListRowKind.Currency) {
        return <UICurrencyRow {...item.props} />;
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
