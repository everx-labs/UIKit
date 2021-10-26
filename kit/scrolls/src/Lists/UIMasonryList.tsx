// (savelichalex): following rule is just broken
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import {
    LayoutChangeEvent,
    NativeScrollEvent,
    View,
    ViewStyle,
    ScrollView,
    NativeSyntheticEvent,
    ScrollViewProps,
} from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { wrapScrollableComponent } from '../wrapScrollableComponent';

const interColumnOffset = UILayoutConstant.contentOffset;
const interRowsOffset = interColumnOffset;

type MasonryItem<Item> = { key: string; item?: Item; aspectRatio: number };

type LayoutCell = {
    height: number;
    x: number;
    y: number;
};

type Layout = Record<string, LayoutCell>;

function measureList<Item>(cellWidth: number, data: MasonryItem<Item>[], numOfColumns: number) {
    const columnsHeights = new Array(numOfColumns).fill(0);

    let maxHeight = 0;

    const layout: Layout = {};

    // Calculating offsets for columns in advance,
    // since for each row they are simply going to
    // be repeated again
    const offsetsByColumn = new Array(numOfColumns).fill(null).map((_, column) => {
        return (
            UILayoutConstant.contentOffset +
            column * cellWidth +
            (column > 0 ? column * interRowsOffset : 0)
        );
    });

    for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const row = Math.trunc(i / numOfColumns);
        const column = i - row * numOfColumns;
        const height = cellWidth * item.aspectRatio;

        if (height > maxHeight) {
            maxHeight = height;
        }

        /**
         * The layout calculation might be changed
         * in future, since for now it's pretty simple
         * and have some flaws, i.e.:
         * - columns have different size,
         *   therefore there is possibly can be a situation
         *   when one column can be much bigger then others
         * - if one item is very big, ones after that item
         *   won't be positioned to fit free space, they just
         *   will be placed as they're in a row
         */
        const y = columnsHeights[column];
        const x = offsetsByColumn[column];

        columnsHeights[column] += height + interColumnOffset;

        // eslint-disable-next-line no-param-reassign
        layout[item.key] = {
            height,
            x,
            y,
        };
    }

    return {
        maxItemHeight: maxHeight,
        contentHeight: Math.max.apply(null, columnsHeights),
        layout,
    };
}

type IndexItem = {
    key: string;
    y: number;
};

function buildIndex<Item>(data: MasonryItem<Item>[], layout: Layout) {
    return data
        .map<IndexItem>(({ key }) => {
            return {
                key,
                y: layout[key].y,
            };
        })
        .sort(({ y: a }, { y: b }) => {
            return a < b ? -1 : 1;
        });
}

// https://www.typescriptlang.org/play?ssl=10&ssc=12&pln=8&pc=19#code/FAMwrgdgxgLglgewgAgEZwgQwE4E8DKApjlABYAUUCC2AJgFzIRgC2qh2ANMhrYQB6EAzowDeyXAFEIDJq3bZkAXwDaAXQCUyUcGR7kAG0IxDhECYC8yAAwBuXfqMnscAOalLPGQOEA6IxCuMKT2+sgA7qRwRsjkMNhghFo6YWFUEEImLHC0tDFWALKYwb7xkFDk5C7uJgDUpuZaAPTIAEwaoal66Zk8MIQsyFa8PkIq2blGap1dPQhG-giu5CldqUbm3NUe3BN5hNxSMoxw-Sy+R7TcVDRXyADkpwMX0rTIAHzIN3T3J2cvMg+X2odAcXSUHTBqTgIFiT3Olw+Vm+tGSULWyG2nj2RhmqSUyEIBiEhG06LWG2xOX2eLCSmA5L0MNiWOQAFoGiYADxWACMaIxYWwxjA2BQWNp+npdOA9IZPRMbysKih4kujF51mU3CaLWsqokrw1vO1yF1yF5BvVFtapvNrStRotAGY7S1nY7jhaACxu5Dez2yXkAVj9wcDGoAbH7IxGLQB2P3xuO8gAcftTKfTSh1LQAnCm837NXHWlqc2aWrzLWE1U6y8WHbXDV6GxXzbyPc3ra0Te2qwHu-Xbf2LeGh63XaPebGJ7JWr7p8m54xWqHp5mV2117mLQWt2u-WXSzvK20a-o663o6PWk3Ly354nb12Hz3n7uF8A1L4hDQYJUV6yJgppAYwqDKFoFifKsgqYiKYrICBXJoMgAD87Imhqkp6BC9jAOacwLAYSzkOgWB4EQJAUK08bcBAhDhMgACC2DYJguDkJqC4aL4IDRAY5DMAYBi8SwmAAA6VAA+twcBQZ8KyPickEaGp9hEYQizLOROAEMQ2BkOQZbcKiHRAA
function binarySearch(coord: number, indexes: { y: number }[]) {
    if (indexes.length === 0) {
        return 0;
    }

    let left = 0;
    let right = indexes.length;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const middle = Math.trunc((right + left) / 2);
        const item = indexes[middle];
        if (item.y >= coord) {
            right = middle;
        } else {
            left = middle;
        }

        if (right - left <= 1) {
            if (indexes[left].y >= coord) {
                return left;
            }
            return right;
        }
    }
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

const UIMasonryListCell = React.memo(
    React.forwardRef<UIMasonryListCellRef, UIMasonryListCellProps>(function UIMasonryListCell(
        { item, renderItem, width, layout }: UIMasonryListCellProps,
        ref,
    ) {
        const [isVisible, setIsVisible] = React.useState(false);
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
        if (acc[key] == null) {
            acc[key] = React.createRef<UIMasonryListCellRef>();
        }
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

function manageTopCells(
    prev: number,
    curr: number,
    show: (start: number, end: number) => void,
    hide: (start: number, end: number) => void,
) {
    if (prev === curr) {
        return;
    }

    if (prev < curr) {
        hide(prev, curr);
    } else {
        show(curr, prev);
    }
}
function manageBottomCells(
    prev: number,
    curr: number,
    show: (start: number, end: number) => void,
    hide: (start: number, end: number) => void,
) {
    if (prev === curr) {
        return;
    }

    if (prev < curr) {
        show(prev, curr);
    } else {
        hide(curr, prev);
    }
}

function useVirtualization<Item>(
    data: MasonryItem<Item>[],
    cellWidth: number,
    numOfColumns: number,
    virtualWindowSizeRatio: number,
    onLayoutProp: ScrollViewProps['onLayout'],
    onScrollProp: ScrollViewProps['onScroll'],
    setWidth: (w: number) => void,
    onEndReached?: (info?: { distanceFromEnd: number }) => void,
    onEndReachedThreshold?: number,
) {
    const lastTopCellIndex = React.useRef(0);
    const lastBottomCellIndex = React.useRef(0);

    const sentEndForContentLength = React.useRef(0);

    const cellsRefs = useMasonryCellsRefs(data);

    const [initialWindowHeight, setInitialWindowHeight] = React.useState(0);

    const { maxItemHeight, contentHeight, cellsIndexes, layout } = React.useMemo(() => {
        if (cellWidth < 0) {
            return {
                maxItemHeight: 0,
                contentHeight: 0,
                cellsIndexes: [],
                layout: {},
            };
        }

        /**
         * This is how it works:
         *
         * Since a developer must provide `aspectRatio` for each item
         * we can calculate the overall height of all items.
         * Also within that pass we calculate coordinates for each cell,
         * that are used to position them in ScrollView properly.
         * Each cell has `position: absolute`.
         */
        const measurement = measureList(cellWidth, data, numOfColumns);
        /**
         * Also we have to build index, to run binary search later (see onScroll).
         * In a nutshell it's just a sorting by `y` coordinate.
         */
        const indexes = buildIndex(data, measurement.layout);

        return {
            ...measurement,
            cellsIndexes: indexes,
        };
    }, [cellWidth, data, numOfColumns]);

    const hide = React.useCallback(
        (start: number, end: number) => {
            for (let i = start; i < end; i += 1) {
                if (cellsIndexes[i] != null) {
                    cellsRefs[cellsIndexes[i].key].current?.hide();
                }
            }
        },
        [cellsIndexes, cellsRefs],
    );
    const show = React.useCallback(
        (start: number, end: number) => {
            for (let i = start; i < end; i += 1) {
                cellsRefs[cellsIndexes[i].key].current?.show();
            }
        },
        [cellsIndexes, cellsRefs],
    );

    React.useEffect(() => {
        /**
         * So basically when we render items for the first time,
         * we have to calculate items that're in virtual window
         */
        const bottom = binarySearch(
            initialWindowHeight + virtualWindowSizeRatio * initialWindowHeight,
            cellsIndexes,
        );
        manageBottomCells(lastBottomCellIndex.current, bottom, show, hide);

        lastBottomCellIndex.current = bottom;
    }, [cellsIndexes, initialWindowHeight, cellsRefs, show, hide, virtualWindowSizeRatio]);

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent) => {
            const {
                nativeEvent: {
                    layout: { width: lWidth, height: lHeight },
                },
            } = event;
            setWidth(lWidth);
            if (initialWindowHeight === 0) {
                setInitialWindowHeight(lHeight);
            }

            if (onLayoutProp) {
                onLayoutProp(event);
            }
        },
        [initialWindowHeight, onLayoutProp, setWidth],
    );

    const maybeCallOnEndReached = React.useCallback(
        (contentLength: number, visibleLength: number) => {
            const distanceFromEnd = contentLength - visibleLength;
            const threshold =
                onEndReachedThreshold != null ? onEndReachedThreshold * contentLength : 2;
            if (
                onEndReached &&
                distanceFromEnd < threshold &&
                contentLength !== sentEndForContentLength.current
            ) {
                // Only call onEndReached once for a given content length
                sentEndForContentLength.current = contentLength;
                onEndReached({ distanceFromEnd });
            } else if (distanceFromEnd > threshold) {
                // If the user scrolls away from the end and back again cause
                // an onEndReached to be triggered again
                sentEndForContentLength.current = 0;
            }
        },
        [onEndReached, onEndReachedThreshold],
    );

    const onScroll = React.useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const {
                nativeEvent: {
                    contentOffset: { y },
                    layoutMeasurement: { height: windowHeight },
                },
            } = event;
            /**
             * This is a core of virtualization.
             *
             * At the point we already prepared a sorted index
             * which we can easily and fast traverse to find
             * cells keys that fit into our virtual window.
             *
             * We use modified binary search algorithm,
             * kinda like "binary search with duplicates to left side".
             *
             * Because we sort index by `y` coordinate,
             * we can easily find what cells to show for bottom edge,
             * but for top edge it's not that easy.
             * For top edge we have to use another index, that is sorted
             * by `y + height` values, to detect bottom edges of cells.
             * But if we did that, we would merge two sets of keys,
             * that is simply not efficient. To prevent that we just modify
             * the top edge on a virtual window, and include height
             * for the most tall cell that we have there. Therefore
             * we can safely use our algorithm for top edge too.
             *
             * So, we found items where a virtual window
             * starts and ends, what next?
             *
             * We could've easily just traverse through all items
             * and change the status for cells. But again, we could do better.
             * To improve that we save last known items and use them for
             * next measurement.
             * So, we have
             * - previous top item
             * - current top item
             * - previous bottom item
             * - current bottom item
             *
             * Since our index is sorted, we can easily find out that
             * items between previous and current items the ones that're
             * changed, and others shouldn't be touched.
             *
             * With this information, we just traverse items between that points,
             * and either turn them on or off, based on condition.
             *
             * You might ask, how cells can be turned on and off?
             * It's done with refs. We render wrappers for all cells,
             * that by default render nothing. These wrappers
             * have methods `show` and `hide`, that simply call
             * internal `useState`.
             */
            const top = binarySearch(
                y - virtualWindowSizeRatio * windowHeight - maxItemHeight,
                cellsIndexes,
            );
            const bottom = binarySearch(
                y + windowHeight + virtualWindowSizeRatio * windowHeight,
                cellsIndexes,
            );
            manageTopCells(lastTopCellIndex.current, top, show, hide);
            manageBottomCells(lastBottomCellIndex.current, bottom, show, hide);
            lastTopCellIndex.current = top;
            lastBottomCellIndex.current = bottom;

            maybeCallOnEndReached(event.nativeEvent.contentSize.height, y + windowHeight);

            if (onScrollProp) {
                onScrollProp(event);
            }
        },
        [
            virtualWindowSizeRatio,
            maxItemHeight,
            cellsIndexes,
            show,
            hide,
            maybeCallOnEndReached,
            onScrollProp,
        ],
    );

    return {
        onLayout,
        onScroll,
        contentHeight,
        cellsRefs,
        layout,
    };
}

type UIMasonryListProps<Item = any> = {
    /**
     * Data for each cell.
     * Please be aware that both list and cells are wrapped with `React.memo`
     * So you have to be sure that you provide a new array
     * if you want to update the list.
     */
    data: MasonryItem<Item>[];
    /**
     * Number of columns.
     *
     * 2 by default.
     */
    numOfColumns?: number;
    /**
     * Callback to render content of the cell.
     */
    renderItem: (item: MasonryItem<Item>) => React.ReactNode;
    /**
     * For virtualization we render items that only fit
     * a virtual window, that is more than the current
     * visible height.
     *
     * That ratio is needed to calculate
     * the size of the virtual window.
     * The ratio will be applied to currently visible height,
     * for both areas on top and bottom.
     * So overall the virtual window will be:
     * - ratio * visible height + height of the biggest item in data
     * - visible height
     * - ratio * visible height.
     *
     * This is always a trade off how big it should be
     * and depends on what data you're trying to render,
     * so you might want to play with the parameter to identify
     * best ratio that fits your needs.
     *
     * Be default is 1.5
     */
    virtualWindowSizeRatio?: number;
    /**
     * Called once when the scroll position gets within `onEndReachedThreshold` of the rendered
     * content.
     */
    onEndReached?: () => void;
    /**
     * How far from the end (in units of visible length of the list) the bottom edge of the
     * list must be from the end of the content to trigger the `onEndReached` callback.
     * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
     * within half the visible length of the list.
     */
    onEndReachedThreshold?: number;
} & ScrollViewProps;

/**
 * Masonry list with virtualization.
 *
 * IMPORTANT:
 * You *must* provide `aspectRatio` for each cell!
 */
const UIMasonryListOriginal = React.memo(
    React.forwardRef<ScrollView, UIMasonryListProps>(function UIMasonryList<Item>(
        {
            data,
            numOfColumns = 2,
            renderItem,
            virtualWindowSizeRatio = 1.5,
            onEndReached,
            onEndReachedThreshold,
            ...scrollViewProps
        }: UIMasonryListProps<Item>,
        ref: React.ForwardedRef<ScrollView>,
    ) {
        const [width, setWidth] = React.useState(0);

        const cellWidth = React.useMemo(() => {
            return (
                (width -
                    2 * UILayoutConstant.contentOffset -
                    (numOfColumns - 1) * interColumnOffset) /
                numOfColumns
            );
        }, [width, numOfColumns]);

        const { onLayout, onScroll, contentHeight, cellsRefs, layout } = useVirtualization(
            data,
            cellWidth,
            numOfColumns,
            virtualWindowSizeRatio,
            scrollViewProps.onLayout,
            scrollViewProps.onScroll,
            setWidth,
            onEndReached,
            onEndReachedThreshold,
        );

        const contentContainerStyle: ViewStyle = React.useMemo(
            () => ({
                position: 'relative',
                height: contentHeight,
            }),
            [contentHeight],
        );

        const content =
            contentHeight > 0 &&
            data.map(item => (
                <UIMasonryListCell
                    ref={cellsRefs[item.key]}
                    key={item.key}
                    item={item}
                    renderItem={renderItem}
                    width={cellWidth}
                    layout={layout[item.key]}
                />
            ));

        return (
            <ScrollView
                {...scrollViewProps}
                ref={ref}
                onLayout={onLayout}
                contentContainerStyle={contentContainerStyle}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {content}
            </ScrollView>
        );
    }),
);

export const UIMasonryList = wrapScrollableComponent(UIMasonryListOriginal, 'UIMasonryList');
