import React from 'react';
import { ListRenderItem, View, StyleSheet } from 'react-native';
import { FlatList } from '..';
import { UIConstant } from '../constants';
import type { GridProps } from './types';

export function UIGridView<T>({
    data,
    renderItem: renderItemProp,
    containerStyle,
    itemHeight,
    testID,
}: GridProps<T>) {
    const [squareSize, setSquareSize] = React.useState({ width: 0, height: 0 });

    const renderItem: ListRenderItem<T> = React.useCallback(
        ({ item, index, separators }) => {
            return (
                <View style={[styles.item, squareSize]}>
                    {renderItemProp?.({ item, index, separators })}
                </View>
            );
        },
        [renderItemProp, squareSize],
    );

    const onLayout = React.useCallback(
        (event: any) => {
            const { width } = event.nativeEvent.layout;
            const squareDimension = width / UIConstant.grid.numColumns - 24;

            setSquareSize({
                width: squareDimension,
                height: itemHeight ?? squareDimension,
            });
        },
        [itemHeight],
    );

    return (
        <View testID={testID} style={[styles.container, containerStyle]} onLayout={onLayout}>
            <FlatList
                data={data}
                numColumns={UIConstant.grid.numColumns}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: UIConstant.scrollContentInsetHorizontal / 2,
    },
    item: {
        margin: UIConstant.scrollContentInsetHorizontal / 2,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
    },
});
