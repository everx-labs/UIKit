import React, { useState } from 'react';
import { View } from 'react-native';
import { UIButton } from '@tonlabs/uikit.hydrogen';
// import { LinearChart } from '@tonlabs/uikit.charts'
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';
import { LinearChart, Point } from '../../../packages/charts/src/index';

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

const dataLength: number = 30;

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
    const [data, setChartData] = useState<Point[]>(getData());
    return (
        <ExampleScreen>
            <ExampleSection title="Chart">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 900,
                        paddingVertical: 20,
                        borderWidth: 1,
                        height: 300,
                    }}
                >
                    <LinearChart {...{ data }} />
                    <UIButton
                        title="refresh"
                        onPress={() => {
                            setChartData(getData());
                        }}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
