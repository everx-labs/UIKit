import React from 'react';
import { ListRenderItem, View, StyleSheet } from 'react-native';
import { FlatList } from '../Scrollable';
import { UIConstant } from '../constants';
import type { GridProps } from './types';

export function UIGridList<T>({
    data,
    renderItem: renderItemProp,
    containerStyle,
    itemHeight = 0,
    testID,
}: GridProps<T>) {
    const renderItem: ListRenderItem<T> = React.useCallback(
        ({ item, index, separators }) => {
            const height = itemHeight ? { height: itemHeight } : styles.itemSquare;
            const isLonelyItem =
                data?.length &&
                data?.length % UIConstant.grid.numColumns &&
                index === data?.length - 1;
            return (
                <View style={[styles.item, height, !!isLonelyItem && styles.lastItem]}>
                    {renderItemProp({ item, index, separators })}
                </View>
            );
        },
        [itemHeight, data?.length, renderItemProp],
    );

    const getItemLayout = React.useCallback(
        (_, index: number) => {
            const itemWithOffset = itemHeight + UIConstant.contentOffset;
            return {
                length: itemWithOffset,
                offset: itemWithOffset * index,
                index,
            };
        },
        [itemHeight],
    );

    return (
        <FlatList
            testID={testID}
            contentContainerStyle={containerStyle}
            data={data}
            numColumns={UIConstant.grid.numColumns}
            columnWrapperStyle={styles.columnWrapperStyle}
            renderItem={renderItem}
            {...(itemHeight && { getItemLayout })}
        />
    );
}

const styles = StyleSheet.create({
    item: {
        margin: UIConstant.contentOffset / 2,
        flex: 0.5,
    },
    lastItem: {
        paddingRight: UIConstant.contentOffset,
        paddingBottom: UIConstant.contentOffset,
    },
    itemSquare: {
        aspectRatio: 1,
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
    },
});
