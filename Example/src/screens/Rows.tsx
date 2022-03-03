import React from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';

import { UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import {
    UIKitListRowKind,
    UIKitListRows,
    renderUIListItem,
    UIListSeparator,
} from '@tonlabs/uicast.rows';

import { UIAccordionSectionList } from '@tonlabs/uikit.scrolls';
// @ts-ignore
import everIcon from './assets/ever.png';
import { useStore } from '../useStore';

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

function renderSectionHeader({ section: { title } }: any) {
    return (
        <UILabel role={UILabelRoles.HeadlineHead} style={{ paddingVertical: 10 }}>
            {title}
        </UILabel>
    );
}

const keyExtractor = (item: any) => item.key;

export const RowsScreen = React.memo(function Rows() {
    const loading = useStore(({ rowsLoading }) => rowsLoading);
    const sections: Array<{
        title: string;
        key: string;
        ItemSeparatorComponent: any;
        data: UIKitListRows;
    }> = React.useMemo(() => {
        return [
            {
                title: 'Link',
                key: 'links',
                data: [
                    {
                        key: `0`,
                        kind: UIKitListRowKind.Link,
                        props: {
                            title: 'Title ',
                            description: 'Description',
                            logo: everIcon,
                            loading,
                            onPress: () => console.log('onPress'),
                        },
                    },
                    {
                        key: `1`,
                        kind: UIKitListRowKind.Link,
                        props: {
                            title: "Let's check out a very long header for this link that you can imagine",
                            // description:
                            // "Let's check out a very long description for this link that you can imagine",
                            logo: everIcon,
                            loading,
                            onPress: () => console.log('onPress'),
                        },
                    },
                ],
                ItemSeparatorComponent: UIListSeparator,
            },
            {
                title: 'Currency',
                key: 'currencies',
                data: new Array(100).fill(null).map((_, index) => ({
                    key: `${index}`,
                    kind: UIKitListRowKind.Currency,
                    props: {
                        name: "Let's check out a very long header for this link that you can imagine",
                        ...(index % 2 === 0
                            ? {
                                  description:
                                      "Let's check out a very long description for this link that you can imagine",
                              }
                            : {}),
                        icon: everIcon,
                        amount: new BigNumber(getRandomNum()),
                        loading,
                        onPress: () => console.log('onPress'),
                    },
                })),
                ItemSeparatorComponent: UIListSeparator,
            },
            {
                title: 'Link',
                key: 'links2',
                data: new Array(100).fill(null).map((_, index) => ({
                    key: `${index}`,
                    kind: UIKitListRowKind.Link,
                    props: {
                        title: "Let's check out a very long header for this link that you can imagine",
                        ...(index % 2 === 0
                            ? {
                                  description:
                                      "Let's check out a very long description for this link that you can imagine",
                              }
                            : {}),
                        logo: everIcon,
                        loading,
                        onPress: () => console.log('onPress'),
                    },
                })),
                ItemSeparatorComponent: UIListSeparator,
            },
        ];
    }, [loading]);

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <UIAccordionSectionList
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    sections={sections}
                    renderItem={renderUIListItem}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={false}
                    keyExtractor={keyExtractor}
                    getItemCount={items => items.length}
                    getItem={(items, index) => items[index]}
                    windowSize={5}
                    automaticallyAdjustContentInsets
                />
            </View>
        </View>
    );
});
