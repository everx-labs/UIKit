import * as React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    UIMaterialTextView,
    UILabel,
    UIBackgroundView,
    ColorVariants,
    UILabelColors,
} from '@tonlabs/uikit.hydrogen';
import {
    ScrollView,
    FlatList,
    createStackNavigator,
    RefreshControl,
    REFRESH_CONTROL_HEIGHT,
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

function RefreshPageController() {
    const [refreshing, setRefreshing] = React.useState(false);
    const turnOnRefreshing = React.useCallback(() => {
        setRefreshing(true);

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setRefreshing(false);
                resolve(undefined);
            }, 1000);
        });
    }, [setRefreshing]);

    return (
        <RefreshControl refreshing={refreshing} onRefresh={turnOnRefreshing} />
    );
}

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
                    renderAboveContent: () => {
                        return <RefreshPageController />;
                    },
                    renderBelowContent: () => {
                        return (
                            <UIBackgroundView
                                color={ColorVariants.BackgroundNegative}
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    marginVertical: 8,
                                }}
                            >
                                <UILabel
                                    color={UILabelColors.TextPrimaryInverted}
                                >
                                    A thing happened and it takes three whole
                                    lines to explain that it happened. This
                                    isn’t likely in English but maybe in German.
                                </UILabel>
                            </UIBackgroundView>
                        );
                    },
                    defaultShift: -REFRESH_CONTROL_HEIGHT,
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
