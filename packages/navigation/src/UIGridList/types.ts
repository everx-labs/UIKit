import type { FlatListProps, ListRenderItem, ViewStyle } from 'react-native';

export type GridProps<ItemT> = {
    /**
     * Data for the grid
     */
    data: FlatListProps<ItemT>['data'];
    /**
     * Takes an item from data and renders it into the list.
     */
    renderItem: ListRenderItem<ItemT>;
    /**
     * GridView container style
     */
    containerStyle?: ViewStyle;
    /**
     * The height of the grid item. By default all items are squares.
     */
    itemHeight?: number;
    /** used for autotests */
    testID?: string;
};
