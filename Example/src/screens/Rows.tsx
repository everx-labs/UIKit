import React from 'react';
import { SectionListData, View } from 'react-native';
import BigNumber from 'bignumber.js';

import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
// import { SectionList } from '@tonlabs/uikit.scrolls';
import { UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIListRowKind, UIListRow, renderUIListItem, UIListSeparator } from '@tonlabs/uicast.rows';

// @ts-ignore
import everIcon from './assets/ever.png';

import { UICollapsableSectionList } from '../../../kit/scrolls/src/Lists/UICollapsableSectionList';

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

const Rows = () => {
    const [loading, setLoading] = React.useState(false);

    const sections: SectionListData<UIListRow, { title: string }>[] = React.useMemo(() => {
        return [
            {
                title: 'Link',
                key: 'links',
                data: [
                    {
                        key: 0,
                        kind: UIListRowKind.Link,
                        props: {
                            title: 'Title ',
                            description: 'Description',
                            logo: everIcon,
                            loading,
                            onPress: () => console.log('onPress'),
                        },
                    },
                    {
                        key: 1,
                        kind: UIListRowKind.Link,
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
                data: new Array(3).fill(null).map((_, index) => ({
                    key: index,
                    kind: UIListRowKind.Currency,
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
                data: [
                    {
                        key: 0,
                        kind: UIListRowKind.Link,
                        props: {
                            title: 'Title ',
                            description: 'Description',
                            logo: everIcon,
                            loading,
                            onPress: () => console.log('onPress'),
                        },
                    },
                    {
                        key: 1,
                        kind: UIListRowKind.Link,
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
        ];
    }, [loading]);

    return (
        // <ExampleSection title="UILink">
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <UICollapsableSectionList
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    sections={sections}
                    renderItem={renderUIListItem}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={false}
                    keyExtractor={item => item.key}
                />
                {/* <UIBoxButton
                    title="Loading..."
                    variant={loading ? UIBoxButtonVariant.Negative : UIBoxButtonVariant.Positive}
                    onPress={() => setLoading(!loading)}
                /> */}
            </View>
        </View>
        // </ExampleSection>
    );
};

const RowsStack = createStackNavigator();

export const RowsScreen = () => {
    return (
        <RowsStack.Navigator>
            <RowsStack.Screen
                name="RowsWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Rows',
                }}
                component={Rows}
            />
        </RowsStack.Navigator>
    );
};
