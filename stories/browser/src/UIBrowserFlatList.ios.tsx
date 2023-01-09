/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { FlatListProps, FlatList, View, StyleSheet } from 'react-native';

type Props<ItemT> = FlatListProps<ItemT> & {
    automaticallyAdjustContentInsets: boolean;
    automaticallyAdjustKeyboardInsets: boolean;
};

export const UIBrowserFlatList = React.memo(
    React.forwardRef<FlatList, Props<any>>(function UIBrowserFlatList<ItemT>(
        {
            automaticallyAdjustContentInsets,
            automaticallyAdjustKeyboardInsets,
            contentInset,
            ...chatListProps
        }: Props<ItemT>,
        forwardRef: React.Ref<FlatList<ItemT>>,
    ) {
        return (
            <View style={styles.container}>
                <FlatList
                    ref={forwardRef}
                    {...chatListProps}
                    automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                    // @ts-ignore
                    automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                    contentInset={contentInset}
                />
            </View>
        );
    }),
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
