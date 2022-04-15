/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { FlatListProps, FlatList, Insets, ViewStyle, StyleSheet, View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';

const emptyInsets: Insets = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
};

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
        const [internalContentInset, setInternalContentInset] = React.useState<Insets>(
            contentInset || emptyInsets,
        );

        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(contentContainerStyleProp) || {};

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    internalContentInset.left,
                ),
                // As the scrollable is inverted
                paddingBottom: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    internalContentInset.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    internalContentInset.right,
                ),
                // As the scrollable is inverted
                paddingTop: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    internalContentInset.bottom,
                ),
            };
        }, [internalContentInset, contentContainerStyleProp]);

        const onInsetsChange = React.useCallback(({ nativeEvent }: { nativeEvent: Insets }) => {
            setInternalContentInset(nativeEvent);
        }, []);

        return (
            <View style={UIStyle.common.flex()}>
                <FlatList
                    ref={forwardRef}
                    {...chatListProps}
                    contentContainerStyle={contentContainerStyle}
                    automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                    // @ts-ignore
                    automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                    // @ts-ignore
                    keyboardInsetAdjustmentBehavior="inclusive"
                    contentInset={contentInset}
                    onInsetsChange={onInsetsChange}
                />
            </View>
        );
    }),
);
