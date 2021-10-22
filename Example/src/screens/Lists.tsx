import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { UIGridList, UIMasonryList } from '@tonlabs/uikit.scrolls';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ColorVariants, TypographyVariants, UILabel, useTheme } from '@tonlabs/uikit.themes';
import { UIBoxButton } from '@tonlabs/uikit.controls';

import { useNavigation } from '@react-navigation/core';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

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

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

function MasonryList() {
    const { width: windowWidth } = useWindowDimensions();
    const width = Math.max(850, windowWidth);

    const numOfColumns = Math.trunc(width / 180);

    const [data] = React.useState(() => {
        return new Array(100 * Math.trunc(Math.random() * 10)).fill(null).map((_, index) => {
            return {
                key: `${index}`,
                aspectRatio: Math.random() * 2,
            };
        });
    });

    const renderItem = React.useCallback(() => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                        Math.random() * 255
                    }, ${0.5 + 0.5 * Math.random()})`,
                }}
            />
        );
    }, []);
    return (
        <View
            style={{
                flex: 1,
                maxWidth: 850,
                margin: 8,
            }}
        >
            <UIMasonryList data={data} numOfColumns={numOfColumns} renderItem={renderItem} />
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
