import * as React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UIMaterialTextView } from '@tonlabs/uikit.hydrogen';
import {
    ScrollView,
    FlatList,
    createStackNavigator,
} from '@tonlabs/uikit.navigation';

const CHECK_TITLE = false;

function LargeHeaderExample() {
    const navigation = useNavigation();
    return (
        <ScrollView>
            {/* To check titles */}
            {CHECK_TITLE && (
                <UIMaterialTextView
                    label="Title"
                    defaultValue="Very long title"
                    onChangeText={(title) => {
                        if (typeof title === 'string' && title) {
                            navigation.setOptions({
                                title,
                            });
                        }
                    }}
                />
            )}
            {new Array(9)
                .fill(null)
                .map((_el, i) => (i + 1) / 10)
                .map((opacity) => (
                    <View
                        key={opacity}
                        style={{
                            height: 100,
                            backgroundColor: `rgba(255,0,0,${opacity})`,
                        }}
                    />
                ))}
        </ScrollView>
    );
}

function LargeHeaderExampleFlatList() {
    return (
        <FlatList
            style={{ backgroundColor: 'blue' }}
            renderItem={({ item: opacity }) => (
                <View
                    key={opacity}
                    style={{
                        height: 100,
                        backgroundColor: `rgba(255,0,0,${opacity})`,
                    }}
                />
            )}
            data={new Array(100).fill(null).map((_el, i) => (i + 1) / 100)}
        />
    );
}

const LargeHeaderStack = createStackNavigator();

export function LargeHeaderScreen() {
    return (
        <LargeHeaderStack.Navigator initialRouteName="scroll-view">
            <LargeHeaderStack.Screen
                name="scroll-view"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Very long title',
                    // onTitlePress: () => {
                    //     console.log('sdfsdf');
                    // },
                    // caption: 'caption',
                    // headerRightItems: [
                    //     {
                    //         label: 'Action1',
                    //         onPress: () => {},
                    //     },
                    //     {
                    //         label: 'Action2',
                    //         onPress: () => {},
                    //     },
                    // ],
                }}
                component={LargeHeaderExample}
            />
            <LargeHeaderStack.Screen
                name="flat-list"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Very long title',
                    // onTitlePress: () => {
                    //     console.log('sdfsdf');
                    // },
                    // caption: 'caption',
                    // headerRightItems: [
                    //     {
                    //         label: 'Action1',
                    //         onPress: () => {},
                    //     },
                    //     {
                    //         label: 'Action2',
                    //         onPress: () => {},
                    //     },
                    // ],
                }}
                component={LargeHeaderExampleFlatList}
            />
        </LargeHeaderStack.Navigator>
    );
}
