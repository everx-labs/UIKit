import * as React from 'react';
import { SectionList as RNSectionList, SectionListProps } from 'react-native';

import { ScrollView } from './ScrollView';

export const SectionList = React.forwardRef<
    RNSectionList,
    SectionListProps<any>
>(function SectionListForwarded<ItemT>(
    props: SectionListProps<ItemT>,
    ref: React.Ref<RNSectionList>,
) {
    return (
        <RNSectionList
            ref={ref}
            {...props}
            renderScrollComponent={(scrollProps) => (
                // @ts-ignore
                <ScrollView {...scrollProps} />
            )}
        />
    );
}) as <ItemT>(props: SectionListProps<ItemT>) => React.ReactElement;

// @ts-ignore
SectionList.displayName = 'SectionList';
