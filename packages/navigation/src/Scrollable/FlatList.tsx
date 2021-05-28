import * as React from 'react';
import { FlatList as RNFlatList, FlatListProps } from 'react-native';

import { ScrollView } from './ScrollView';

export function FlatList<ItemT>(props: FlatListProps<ItemT>) {
    return (
        <RNFlatList
            {...props}
            renderScrollComponent={(scrollProps) => (
                <ScrollView {...scrollProps} />
            )}
        />
    );
}
