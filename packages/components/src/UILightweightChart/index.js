// @flow
import React from 'react';
import { View } from 'react-native';
import { createChart, SeriesDataItemTypeMap, TSeriesType } from 'lightweight-charts';

import { UIColor } from '@tonlabs/uikit.core';
import moment from 'moment'


const lengthOfData: number = 100
// const getMockData = (): SeriesDataItemTypeMap[TSeriesType][] => {
//     return Array(lengthOfData).fill(null).map((_: null, index: number): SeriesDataItemTypeMap[TSeriesType] => {
//         return {
//             time: moment().subtract(lengthOfData - index, 'days').format('YYYY-MM-DD'),
//             value: Math.floor(Math.random() * 1000),
//         }
//     })
// }
const getMockData = () => {
    let lastValue = Math.floor(Math.random() * 1000)
    return Array(lengthOfData).fill(null).map((_, index) => {
        const diff = Math.random() * 10 - 4
        lastValue += diff
        return {
            time: moment().subtract(lengthOfData - index, 'days').format('YYYY-MM-DD'),
            value: lastValue,
        }
    })
}

const chartSettings = {
    height: 380,
    layout: {
        backgroundColor: UIColor.backgroundPrimary(),
    },
    timeScale: {
        tickMarkFormatter: (time) => {
            const date = new Date(time.year, time.month, time.day);
            return (
                `${date.getFullYear() 
                }/${ 
                date.getMonth() + 1 
                }/${ 
                date.getDate()}`
            );
        },
    },
    grid: {
        vertLines: {
            visible: false,
        },
    },
    crosshair: {
        horzLine: {
            visible: false,
            labelVisible: true,
        },
        vertLine: {
            visible: true,
            labelVisible: false,
        },
    },
}

const lineSettings = {
    topColor: 'rgba(156, 39, 176, 1)',
    bottomColor: 'rgba(41, 121, 255, 0.1)',
    lineColor: 'rgba(156, 39, 176, 0.8)',
    lineWidth: 1,
}

const UILightweightChart = () => {
    const containerRef = React.useRef<typeof View>(<View/>); // FIXME
    React.useEffect(() => {
        const chart = createChart(containerRef.current, chartSettings);
        const lineSeries = chart.addAreaSeries(lineSettings);
        lineSeries.setData(getMockData());
        return () => {
            chart.remove();
        };
    }, [containerRef]);

    return (
        <View
            ref={containerRef}
            style={{ width: '100%' }}
        />
    );
};

export { UILightweightChart as default };
