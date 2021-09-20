import * as React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIAnimatedBalance } from '@tonlabs/uikit.flask';
import { UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.hydrogen';

import { ExampleScreen } from '../components/ExampleScreen';
import { ExampleSection } from '../components/ExampleSection';

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

function AnimatedBalance() {
    const [val, setVal] = React.useState(getRandomNum());
    const [loading, setLoading] = React.useState(false);

    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <UIAnimatedBalance
                value={val}
                icon={UIAssets.icons.brand.tonSymbolBlack}
                loading={loading}
            />
            <UIBoxButton
                title="Change it!"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(getRandomNum());
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="+"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val + 10 ** Math.abs(Math.floor(Math.random() * 10) - 5));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="-"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val - 10 ** Math.abs(Math.floor(Math.random() * 10) - 5));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="Loading"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setLoading(!loading);
                }}
            />
        </View>
    );
}

function Finances() {
    return (
        <ExampleScreen>
            <ExampleSection title="UIAnimatedBalance">
                <AnimatedBalance />
            </ExampleSection>
        </ExampleScreen>
    );
}

const FinancesStack = createStackNavigator();

export function FinancesScreen() {
    return (
        <FinancesStack.Navigator>
            <FinancesStack.Screen
                name="FinancesWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Finances',
                }}
                component={Finances}
            />
        </FinancesStack.Navigator>
    );
}
