// (savelichalex): following rule is just broken
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import {
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    View,
    ViewStyle,
} from 'react-native';

import { UIConstant } from '../constants';

const interColumnOffset = UIConstant.contentOffset / 2;
const interRowsOffset = interColumnOffset;

type MasonryItem<Item> = { key: string; item?: Item; aspectRatio: number };

type LayoutCell = {
    height: number;
    x: number;
    y: number;
};

type Layout = Record<string, LayoutCell>;

function measureList<Item>(
    cellWidth: number,
    data: MasonryItem<Item>[],
    numOfColumns: number,
    layout: Layout,
) {
    const columnsHeights = new Array(numOfColumns).fill(0);

    for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const row = Math.trunc(i / numOfColumns);
        const column = i - row * numOfColumns;
        const height = cellWidth * item.aspectRatio;

        const y = columnsHeights[column];
        // TODO: maybe precompute it?
        const x =
            UIConstant.contentOffset +
            column * cellWidth +
            (column > 0 ? column * interRowsOffset : 0);

        columnsHeights[column] += height + interColumnOffset;

        if (layout[item.key] != null) {
            continue;
        }

        // eslint-disable-next-line no-param-reassign
        layout[item.key] = {
            height,
            x,
            y,
        };
    }
    return Math.max.apply(null, columnsHeights);
}

type UIMasonryListCellRef = {
    show: () => void;
    hide: () => void;
};

type UIMasonryListCellProps<Item = any> = {
    item: MasonryItem<Item>;
    renderItem: (item: MasonryItem<Item>) => React.ReactNode;
    width: number;
    layout: LayoutCell;
};

/**
 * TODO: I just feel that it might produce some bugs with layout being a ref
 * but can't imagine a case
 */
const UIMasonryListCell = React.memo(
    React.forwardRef<UIMasonryListCellRef, UIMasonryListCellProps>(function UIMasonryListCell(
        { item, renderItem, width, layout }: UIMasonryListCellProps,
        ref,
    ) {
        const [isVisible, setIsVisible] = React.useState(true);
        React.useImperativeHandle(ref, () => ({
            show() {
                setIsVisible(true);
            },
            hide() {
                setIsVisible(false);
            },
        }));

        if (!isVisible) {
            return null;
        }

        return (
            <View
                style={{
                    position: 'absolute',
                    top: layout.y,
                    left: layout.x,
                    width,
                    height: layout.height,
                }}
            >
                {renderItem(item)}
            </View>
        );
    }),
);

type MasonryCellsRefs = Record<string, React.RefObject<UIMasonryListCellRef>>;

function getMasonryCellsRefs<Item>(data: MasonryItem<Item>[]) {
    return data.reduce<MasonryCellsRefs>((acc, { key }) => {
        if (acc[key] != null) {
            return acc;
        }
        acc[key] = React.createRef<UIMasonryListCellRef>();
        return acc;
    }, {});
}

function useMasonryCellsRefs<Item>(data: MasonryItem<Item>[]) {
    const cellsRefs = React.useRef<MasonryCellsRefs>();

    if (cellsRefs.current == null) {
        cellsRefs.current = getMasonryCellsRefs(data);
    }

    React.useEffect(() => {
        cellsRefs.current = getMasonryCellsRefs(data);
    }, [data]);

    return cellsRefs.current;
}

export const UIMasonryList = React.memo(function UIMasonryList<Item>({
    data,
    numOfColumns,
    renderItem,
}: {
    data: MasonryItem<Item>[];
    numOfColumns: number;
    renderItem: (item: MasonryItem<Item>) => React.ReactNode;
}) {
    const [width, setWidth] = React.useState(0);

    const onLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width: lWidth },
            },
        }: LayoutChangeEvent) => {
            if (lWidth !== width) setWidth(lWidth);
        },
        [width],
    );

    const cellWidth = React.useMemo(() => {
        return (
            (width - 2 * UIConstant.contentOffset - (numOfColumns - 1) * interColumnOffset) /
            numOfColumns
        );
    }, [width, numOfColumns]);

    const layoutRef = React.useRef<Layout>({});

    const height = React.useMemo(() => {
        if (width === 0) {
            return 0;
        }

        return measureList(cellWidth, data, numOfColumns, layoutRef.current);
    }, [width, cellWidth, data, numOfColumns]);

    const contentContainerStyle: ViewStyle = React.useMemo(
        () => ({
            position: 'relative',
            height,
        }),
        [height],
    );

    const cellsRefs = useMasonryCellsRefs(data);

    const content =
        height > 0 &&
        data.map(item => (
            <UIMasonryListCell
                ref={cellsRefs[item.key]}
                key={item.key}
                item={item}
                renderItem={renderItem}
                width={cellWidth}
                layout={layoutRef.current[item.key]}
            />
        ));

    const onScroll = React.useCallback(
        ({
            nativeEvent: {
                contentOffset: { y },
                contentSize: { height: contentHeight },
                layoutMeasurement: { height: windowHeight },
            },
        }: NativeSyntheticEvent<NativeScrollEvent>) => {
            console.log(y, contentHeight, windowHeight);
        },
        [],
    );

    return (
        <ScrollView
            onLayout={onLayout}
            contentContainerStyle={contentContainerStyle}
            onScroll={onScroll}
            scrollEventThrottle={16 * 3}
        >
            {content}
        </ScrollView>
    );
});
