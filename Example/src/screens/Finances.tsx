import * as React from 'react';
import { View, Platform, I18nManager, NativeModules } from 'react-native';

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
    const [val, setVal] = React.useState(getRandomNum());

    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UINumber animated value={val} />
                    <View style={{ height: 10 }} />
                    <UINumber value={val} />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Short</UILabel>
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UINumber
                        animated
                        value={val}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    />
                    <View style={{ height: 10 }} />
                    <UINumber value={val} decimalAspect={UINumberDecimalAspect.ShortEllipsized} />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>ShortEllipsized</UILabel>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <UINumber
                        animated
                        value={val}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    />
                    <View style={{ height: 10 }} />
                    <UINumber value={val} decimalAspect={UINumberDecimalAspect.Precision} />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Precision</UILabel>
            </View>
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
        </View>
    );
}

function Currencies() {
    const [val, setVal] = React.useState(getRandomNum());
    const [loading, setLoading] = React.useState(false);

    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UICurrency
                        animated
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                    />
                    <View style={{ height: 10 }} />
                    <UICurrency animated value={val} signChar="$" loading={loading} />
                    <View style={{ height: 10 }} />
                    <UICurrency
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                    />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Short</UILabel>
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UICurrency
                        animated
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    />
                    <View style={{ height: 10 }} />
                    <UICurrency
                        animated
                        value={val}
                        signChar="$"
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    />
                    <View style={{ height: 10 }} />
                    <UICurrency
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>ShortEllipsized</UILabel>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <UICurrency
                        animated
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    />
                    <View style={{ height: 10 }} />
                    <UICurrency
                        animated
                        value={val}
                        signChar="$"
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    />
                    <View style={{ height: 10 }} />
                    <UICurrency
                        value={val}
                        signIcon={UIAssets.icons.brand.tonSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Precision}
                    />
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Precision</UILabel>
            </View>
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
