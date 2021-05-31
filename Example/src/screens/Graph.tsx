import React, { useState } from 'react';
import { View } from 'react-native';
import { UIButton } from '@tonlabs/uikit.hydrogen'
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';
import GraphImpl from '../../../packages/hydrogen/src/Graph/Graph';

const getRandomValue = () => Math.floor(Math.random() * 100000) / 100;

const dataLength: number = 30;

const getData = (): [number, number][] => {
    return Array(dataLength)
        .fill(0)
        .map((_, index: number) => {
            return { x: new Date(2020, 5, index), y: getRandomValue() };
        })
        .map((p) => [p.x.getTime(), p.y]);
};

export function Graph() {
    const [data, setGraphData] = useState<[number, number][]>(getData());
    return (
        <ExampleScreen>
            <ExampleSection title="Graph">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 900,
                        paddingVertical: 20,
                        borderWidth: 1,
                        height: 300,
                    }}
                >
                    <GraphImpl {...{ data }} />
                    <UIButton
                        title="refresh"
                        onPress={() => {
                            setGraphData(getData());
                        }}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
