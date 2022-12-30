/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { FlatListProps, FlatList, ViewStyle, StyleSheet, View } from 'react-native';

function getContentContainerPadding(padding: ViewStyle['padding'], inset: number | undefined) {
    if (padding == null) {
        return inset ?? 0;
    }

    if (typeof padding === 'string') {
        return padding;
    }

    return padding + (inset ?? 0);
}

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
            contentContainerStyle: contentContainerStyleProp,
            ...chatListProps
        }: Props<ItemT>,
        forwardRef: React.Ref<FlatList<ItemT>>,
    ) {
        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(contentContainerStyleProp) || {};

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    contentInset?.left,
                ),
                // As the scrollable is inverted
                paddingBottom: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    contentInset?.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    contentInset?.right,
                ),
                // As the scrollable is inverted
                paddingTop: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    contentInset?.bottom,
                ),
            };
        }, [contentInset, contentContainerStyleProp]);

        return (
            <View style={styles.container}>
                <FlatList
                    ref={forwardRef}
                    {...chatListProps}
                    contentContainerStyle={contentContainerStyle}
                    automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                    // @ts-ignore
                    automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                    // @ts-ignore
                    keyboardInsetAdjustmentBehavior="inclusive"
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
