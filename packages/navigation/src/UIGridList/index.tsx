import React from 'react';
import { ListRenderItem, View, StyleSheet } from 'react-native';
import { FlatList } from '..';
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
            return (
                <View style={[styles.item, height]}>
                    {renderItemProp({ item, index, separators })}
                </View>
            );
        },
        [renderItemProp, itemHeight],
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(itemHeight && { getItemLayout })}
        />
    );
}

const styles = StyleSheet.create({
    item: {
        margin: UIConstant.contentOffset / 2,
        flex: 0.5,
    },
    itemSquare: {
        aspectRatio: 1,
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
    },
});
