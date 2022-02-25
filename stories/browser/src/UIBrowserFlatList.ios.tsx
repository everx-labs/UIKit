/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { FlatListProps, FlatList, View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { ScrollableAutomaticInsets } from '@tonlabs/uikit.scrolls';

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
        const automaticInsets =
            automaticallyAdjustContentInsets || automaticallyAdjustKeyboardInsets;

        return (
            <View style={UIStyle.common.flex()}>
                <FlatList ref={forwardRef} {...chatListProps} />
                {automaticInsets ? (
                    // The position of a component is very important
                    // See UIKitScrollViewInsets.m for details
                    <ScrollableAutomaticInsets
                        automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                        contentInset={contentInset}
                    />
                ) : null}
            </View>
        );
    }),
);
