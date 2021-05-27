import * as React from 'react';
import { View } from 'react-native';

import { ScrollView, createStackNavigator } from '@tonlabs/uikit.navigation';

function LargeHeaderExample() {
    return (
        <ScrollView>
            {new Array(9)
                .fill(null)
                .map((_el, i) => (i + 1) / 10)
                // .reverse()
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

const LargeHeaderStack = createStackNavigator();

export function LargeHeaderScreen() {
    return (
        <LargeHeaderStack.Navigator>
            <LargeHeaderStack.Screen
                name="LargeHeaderWindow"
                options={{
                    headerLargeTitle: true,
                    title: 'Long title',
                }}
                component={LargeHeaderExample}
            />
        </LargeHeaderStack.Navigator>
    );
}
