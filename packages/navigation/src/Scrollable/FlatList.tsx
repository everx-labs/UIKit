import * as React from 'react';
import { FlatList as RNFlatList, FlatListProps } from 'react-native';

import { ScrollView } from './ScrollView';

export const FlatList = React.forwardRef<RNFlatList, FlatListProps<any>>(
    function FlatListForwarded<ItemT>(
        props: FlatListProps<ItemT>,
        ref: React.Ref<RNFlatList>,
    ) {
        return (
            <RNFlatList
                ref={ref}
                {...props}
                renderScrollComponent={(scrollProps) => (
                    // @ts-ignore
                    <ScrollView {...scrollProps} />
                )}
            />
        );
    },
) as <ItemT>(props: FlatListProps<ItemT>) => React.ReactElement;

// @ts-ignore
FlatList.displayName = 'FlatList';
