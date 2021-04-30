import * as React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import {
    AreaSeriesPartialOptions,
    ChartOptions,
    DeepPartial,
    IChartApi,
    ISeriesApi,
    SeriesDataItemTypeMap,
    TSeriesType,
    createChart,
} from 'lightweight-charts';

import { UIColor } from '@tonlabs/uikit.core';

const lengthOfData: number = 100;
const getMockData = (): SeriesDataItemTypeMap[TSeriesType][] => {
    let lastValue: number = Math.floor(Math.random() * 1000);
    return Array(lengthOfData)
        .fill(null)
        .map((value: null, index: number): SeriesDataItemTypeMap[TSeriesType] => {
            const diff: number = Math.random() * 10 - 4;
            lastValue += diff;
            return {
                time: moment()
                    .subtract(lengthOfData - index, 'days')
                    .format('YYYY-MM-DD'),
                value: lastValue,
            };
        });
};

const chartSettings: DeepPartial<ChartOptions> = {
    height: 380,
    layout: {
        backgroundColor: UIColor.backgroundPrimary(),
    },
    timeScale: {
        tickMarkFormatter: (time) => {
            const date = new Date(time.year, time.month, time.day);
            return `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()}`;
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
};

const lineSettings: AreaSeriesPartialOptions = {
    topColor: 'rgba(156, 39, 176, 1)',
    bottomColor: 'rgba(41, 121, 255, 0.1)',
    lineColor: 'rgba(156, 39, 176, 0.8)',
    lineWidth: 1,
};

const UILightweightChart: React.FC = () => {
    const containerRef: React.RefObject<View> = React.useRef<View>(null);
    React.useEffect(() => {
        const chart: IChartApi = createChart(containerRef.current, chartSettings);
        const lineSeries: ISeriesApi<'Area'> = chart.addAreaSeries(lineSettings);
        lineSeries.setData(getMockData());
        return () => {
            chart.remove();
        };
    }, [containerRef]);

    return <View ref={containerRef} style={{ width: '100%' }} />;
};

export default UILightweightChart;
