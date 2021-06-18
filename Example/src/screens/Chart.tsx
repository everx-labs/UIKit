import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { ColorVariants, UIButton, useTheme } from '@tonlabs/uikit.hydrogen';
import { LinearChart, Point } from '@tonlabs/uikit.charts'
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const getRandomSign = (): number => {
    return Math.random() > 0.5 ? 1 : -1;
};
const getRandomValue = () =>
    (Math.floor(Math.random() * 10) / 10) * getRandomSign();

let acc = 100;
const getСumulativeValue = () => {
    acc += getRandomValue();
    return acc;
};

const dataLength: number = 60;

const getData = (): Point[] => {
    acc = 100;
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
    const [data, setChartData] = useState<Point[]>(getData());
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
                            backgroundColor:
                                theme[ColorVariants.BackgroundSecondary],
                        }}
                    >
                        <LinearChart {...{ data }} />
                    </View>
                    <UIButton
                        title="Refresh"
                        onPress={() => {
                            setChartData(getData());
                        }}
                        style={{
                            margin: 16,
                            alignSelf: 'flex-end',
                        }}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
