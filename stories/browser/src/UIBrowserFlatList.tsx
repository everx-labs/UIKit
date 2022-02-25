/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { FlatListProps, FlatList } from 'react-native';

type Props<ItemT> = FlatListProps<ItemT> & {
    automaticallyAdjustContentInsets: boolean;
    automaticallyAdjustKeyboardInsets: boolean;
};

export const UIBrowserFlatList = React.memo(
    React.forwardRef<FlatList, Props<any>>(function UIBrowserFlatList<ItemT>(
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            automaticallyAdjustContentInsets,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            automaticallyAdjustKeyboardInsets,
            ...chatListProps
        }: Props<ItemT>,
        forwardRef: React.Ref<FlatList<ItemT>>,
    ) {
        return <FlatList ref={forwardRef} {...chatListProps} />;
    }),
);
