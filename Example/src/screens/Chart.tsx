import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { UILinkButton, UILinkButtonSize } from '@tonlabs/uikit.controls';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { LinearChart, LinearChartPoint } from '@tonlabs/uikit.charts';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const getRandomSign = (): number => {
    return Math.random() > 0.5 ? 1 : -1;
};
const getRandomValue = () => (Math.floor(Math.random() * 1000000) / 10) * getRandomSign();

let acc = 0;
const getСumulativeValue = () => {
    acc += getRandomValue();
    return acc;
};

const dataLength: number = 60;

const getData = (): LinearChartPoint[] => {
    acc = 1000000;
    return Array(dataLength)
        .fill(0)
        .map((_, index: number) => {
            return {
                x: new Date(2020, 5, index).getTime(),
                y: getСumulativeValue(),
            };
        });
};

export function Chart() {
    const theme = useTheme();
    const [data, setChartData] = useState<LinearChartPoint[]>(getData());
    return (
        <ExampleScreen>
            <ExampleSection title="Chart">
                <View
                    style={{
                        alignSelf: 'stretch',
                        maxWidth: 900,
                        marginVertical: 20,
                        marginHorizontal: Platform.OS === 'web' ? 20 : 0,
                        height: 300,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: theme[ColorVariants.BackgroundSecondary],
                        }}
                    >
                        <LinearChart {...{ data }} />
                    </View>
                    <View style={{ alignSelf: 'flex-end', margin: 16 }}>
                        <UILinkButton
                            title="Refresh"
                            size={UILinkButtonSize.Small}
                            onPress={() => {
                                setChartData(getData());
                            }}
                        />
                    </View>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
