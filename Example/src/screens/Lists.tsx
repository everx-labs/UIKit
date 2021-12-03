import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { UIGridList, UIMasonryList, MasonryItem } from '@tonlabs/uikit.scrolls';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ColorVariants, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.themes';
import { UIBoxButton } from '@tonlabs/uikit.controls';

import { useNavigation } from '@react-navigation/core';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

type Item = { page: number; index: number };

function GridList() {
    const theme = useTheme();

    const renderItem = ({ item }: any) => {
        return (
            <View
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundSecondary],
                    flex: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <UILabel role={TypographyVariants.TitleLarge}>{item}</UILabel>
            </View>
        );
    };

    return (
        <ExampleSection title="UIGridView">
            <View
                style={{
                    flex: 1,
                    maxWidth: 500,
                    margin: 8,
                }}
            >
                <UIGridList
                    // itemHeight={300}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                    renderItem={renderItem}
                />
            </View>
        </ExampleSection>
    );
}

function generateData(page: number): MasonryItem<Item>[] {
    const newData = new Array(123).fill(null).map((_, index) => {
        return {
            key: `${page}_${index}`,
            item: { page, index },
            aspectRatio: 0.5 + (index % 5),
        };
    });
    return newData;
}

const Footer = React.memo(() => {
    return (
        <View
            style={{
                height: 100,
                backgroundColor: 'red',
            }}
        />
    );
});

function MasonryList() {
    const { width: windowWidth } = useWindowDimensions();
    const width = Math.max(850, windowWidth);

    const numOfColumns = Math.trunc(width / 180);

    const [page, setPage] = React.useState(0);

    const [data, setData] = React.useState<MasonryItem<Item>[]>([]);

    React.useEffect(() => {
        setData(oldData => [...oldData, ...generateData(page)]);
    }, [page]);

    const [isFooterVisible, setIsFooterVisible] = React.useState(false);

    const renderItem = React.useCallback(({ item }: MasonryItem<Item>) => {
        if (item) {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: `rgb(${item.page * item.index}, ${
                            item.page + item.index
                        }, ${item.index ** item.page})`,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <UILabel
                        role={TypographyVariants.HeadersHuge}
                        color={ColorVariants.TextPrimaryInverted}
                    >
                        {item.index}
                    </UILabel>
                </View>
            );
        }
        return null;
    }, []);
    return (
        <View
            style={{
                flex: 1,
                maxWidth: 850,
                margin: 8,
            }}
        >
            <UIMasonryList
                data={data}
                numOfColumns={numOfColumns}
                onEndReached={() => {
                    if (page < 5) {
                        setIsFooterVisible(true);
                        setTimeout(() => {
                            setPage(page + 1);
                            setIsFooterVisible(false);
                        }, 4000);
                    }
                }}
                renderItem={renderItem}
                ListFooterComponent={isFooterVisible ? Footer : null}
            />
        </View>
    );
}

function Lists() {
    const navigation = useNavigation();
    return (
        <ExampleScreen>
            <UIBoxButton
                title="MasonryList"
                onPress={() => navigation.navigate('MasonryList')}
                layout={{ marginBottom: 10 }}
            />
            <UIBoxButton title="GridList" onPress={() => navigation.navigate('GridList')} />
        </ExampleScreen>
    );
}

const ListsStack = createStackNavigator();

export function ListsScreen() {
    return (
        <ListsStack.Navigator initialRouteName="Lists">
            <ListsStack.Screen
                name="Lists"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Lists',
                }}
                component={Lists}
            />
            <ListsStack.Screen
                name="MasonryList"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'UIMasonryList',
                }}
                component={MasonryList}
            />
            <ListsStack.Screen
                name="GridList"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'UIGridList',
                }}
                component={GridList}
            />
        </ListsStack.Navigator>
    );
}
