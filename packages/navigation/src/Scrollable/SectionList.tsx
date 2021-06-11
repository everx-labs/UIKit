import * as React from 'react';
import { SectionList as RNSectionList, SectionListProps } from 'react-native';

import { ScrollView } from './ScrollView';

export function SectionList<ItemT>(props: SectionListProps<ItemT>) {
    return (
        <RNSectionList
            {...props}
            renderScrollComponent={(scrollProps) => (
                <ScrollView {...scrollProps} />
            )}
        />
    );
}
