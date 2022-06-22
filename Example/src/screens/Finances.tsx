import * as React from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UILabel, UILabelColors, TypographyVariants } from '@tonlabs/uikit.themes';
import { UINumber, UICurrency, UINumberDecimalAspect } from '@tonlabs/uicast.numbers';
import { UIBoxButton, UIBoxButtonType, TouchableOpacity } from '@tonlabs/uikit.controls';

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
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
                        loading={loading}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency animated signChar="$" loading={loading}>
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency signIcon={UIAssets.icons.brand.surfSymbolBlack} loading={loading}>
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
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
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
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.ShortEllipsized}
                    >
                        {val}
                    </UICurrency>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>ShortEllipsized</UILabel>
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}
            >
                <View>
                    <UICurrency
                        animated
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Medium}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        animated
                        signChar="$"
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Medium}
                    >
                        {val}
                    </UICurrency>
                    <View style={{ height: 10 }} />
                    <UICurrency
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
                        loading={loading}
                        decimalAspect={UINumberDecimalAspect.Medium}
                    >
                        {val}
                    </UICurrency>
                </View>
                <UILabel color={UILabelColors.TextSecondary}>Medium</UILabel>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <UICurrency
                        animated
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
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
                        signIcon={UIAssets.icons.brand.surfSymbolBlack}
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

/**
 * There was a bug on Android with previous implementation
 * that touchable wasn't received press events
 * when the number itself was touched
 *
 * Leave it here to test regression
 */
function TouchableUICurrency() {
    const [val, setVal] = React.useState(new BigNumber(getRandomNum()));
    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <TouchableOpacity
                onPress={() => {
                    setVal(new BigNumber(getRandomNum()));
                }}
                style={{ paddingHorizontal: 10, paddingVertical: 20 }}
            >
                <UICurrency
                    animated
                    signIcon={UIAssets.icons.brand.surfSymbolBlack}
                    decimalAspect={UINumberDecimalAspect.Precision}
                >
                    {val}
                </UICurrency>
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                }}
            >
                <UICurrency
                    animated
                    signIcon={UIAssets.icons.brand.surfSymbolBlack}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
                <UICurrency
                    signIcon={UIAssets.icons.brand.surfSymbolBlack}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <UICurrency
                    animated
                    loading
                    signIcon={UIAssets.icons.brand.surfSymbolBlack}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
                <UICurrency
                    loading
                    signIcon={UIAssets.icons.brand.surfSymbolBlack}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
            </View>
        </View>
    );
}

const icons = [
    UIAssets.icons.payment.applepay,
    UIAssets.icons.payment.googlepay,
    UIAssets.icons.brand.surfSymbolBlack,
];

/**
 * There was a bug on Android, when changing an icon
 * it was rendered with an inpropper size.
 *
 * Leave it here for regression testing
 */
function IconsUICurrency() {
    const [val, setVal] = React.useState(new BigNumber(getRandomNum()));
    const [icon, setIcon] = React.useState(icons[2]);
    return (
        <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
            <TouchableOpacity
                onPress={() => {
                    setVal(new BigNumber(getRandomNum()));
                    setIcon(icons[Math.trunc(Math.random() * 10) % 3]);
                }}
                style={{ paddingHorizontal: 10, paddingVertical: 20 }}
            >
                <UICurrency
                    animated
                    signIcon={icon}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setVal(new BigNumber(getRandomNum()));
                    setIcon(icons[Math.trunc(Math.random() * 10) % 3]);
                }}
                style={{ paddingHorizontal: 10, paddingVertical: 20 }}
            >
                <UICurrency
                    animated
                    loading
                    signIcon={icon}
                    decimalAspect={UINumberDecimalAspect.Short}
                    integerVariant={TypographyVariants.LightLarge}
                    decimalVariant={TypographyVariants.LightLarge}
                >
                    {val}
                </UICurrency>
            </TouchableOpacity>
        </View>
    );
}

export function FinancesScreen() {
    return (
        <ExampleScreen>
            <ExampleSection title="UINumber">
                <Numbers />
            </ExampleSection>
            <ExampleSection title="UICurrency">
                <Currencies />
            </ExampleSection>
            <ExampleSection title="UICurrency in touchable">
                <TouchableUICurrency />
            </ExampleSection>
            <ExampleSection title="UICurrency various icons">
                <IconsUICurrency />
            </ExampleSection>
            <View style={{ height: 50 }} />
        </ExampleScreen>
    );
}
