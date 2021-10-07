import * as React from 'react';
import { View, Platform, I18nManager, NativeModules } from 'react-native';
import BigNumber from 'bignumber.js';

import { createStackNavigator } from '@tonlabs/uikit.navigation';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UINumber,
    UICurrency,
    UINumberDecimalAspect,
    UIBoxButton,
    UIBoxButtonType,
    UILabel,
    UILabelColors,
} from '@tonlabs/uikit.hydrogen';

import { ExampleScreen } from '../components/ExampleScreen';
import { ExampleSection } from '../components/ExampleSection';

export function getRandomNum() {
    const num = Math.random();
    const symbols = 10 ** (Math.floor(Math.random() * 10) + 1);

    return Math.floor(num * symbols) / 100;
}

function Numbers() {
    const [val, setVal] = React.useState(new BigNumber(getRandomNum()));

    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UINumber animated>{val}</UINumber>
                    <View style={{ height: 10 }} />
                    <UINumber>{val}</UINumber>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Short</UILabel>
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UINumber animated decimalAspect={UINumberDecimalAspect.ShortEllipsized}>
                        {val}
                    </UINumber>
                    <View style={{ height: 10 }} />
                    <UINumber decimalAspect={UINumberDecimalAspect.ShortEllipsized}>{val}</UINumber>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>ShortEllipsized</UILabel>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <UINumber animated decimalAspect={UINumberDecimalAspect.Precision}>
                        {val}
                    </UINumber>
                    <View style={{ height: 10 }} />
                    <UINumber decimalAspect={UINumberDecimalAspect.Precision}>{val}</UINumber>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Precision</UILabel>
            </View>
            <UIBoxButton
                title="Change it!"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(new BigNumber(getRandomNum()));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="+"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val.plus(10 ** Math.abs(Math.floor(Math.random() * 10) - 5)));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="-"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val.minus(10 ** Math.abs(Math.floor(Math.random() * 10) - 5)));
                }}
                layout={{ marginBottom: 5 }}
            />
        </View>
    );
}

function Currencies() {
    const [val, setVal] = React.useState(new BigNumber(getRandomNum()));
    const [loading, setLoading] = React.useState(false);

    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UICurrency
                        animated
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency animated signChar="$" loading={loading}>
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency signIcon={UIAssets.icons.brand.tonSymbolBlack} loading={loading}>
                        {val}
                    </UICurrency>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Short</UILabel>
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UICurrency
                        animated
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        animated
                        signChar="$"
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    >
                        {val}
                    </UICurrency>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>ShortEllipsized</UILabel>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <UICurrency
                        animated
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        animated
                        signChar="$"
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    >
                        {val}
                    </UICurrency>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Precision</UILabel>
            </View>
            <UIBoxButton
                title="Change it!"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(new BigNumber(getRandomNum()));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="+"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val.plus(10 ** Math.abs(Math.floor(Math.random() * 10) - 5)));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="-"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(val.minus(10 ** Math.abs(Math.floor(Math.random() * 10) - 5)));
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="Loading"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setLoading(!loading);
                }}
                layout={{ marginBottom: 5 }}
            />
            <UIBoxButton
                title="Set really big value"
                type={UIBoxButtonType.Tertiary}
                onPress={() => {
                    setVal(new BigNumber('100000000000000000000.000000002'));
                }}
            />
        </View>
    );
}

function Finances() {
    return (
        <ExampleScreen>
            <ExampleSection title="UINumber">
                <Numbers />
            </ExampleSection>
            <ExampleSection title="UICurrency">
                <Currencies />
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
                    headerRightItems: [
                        Platform.OS === 'ios' && {
                            label: `${I18nManager.isRTL ? 'Disable' : 'Enable'} RTL`,
                            onPress: () => {
                                I18nManager.forceRTL(!I18nManager.isRTL);
                                NativeModules.DevSettings.reload();
                            },
                        },
                    ],
                }}
                component={Finances}
            />
        </FinancesStack.Navigator>
    );
}
