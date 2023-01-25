import type { SectionListProps } from 'react-native';

export type SectionListDataProp = Array<{
    title: string;
    data: any[];
}>;

export interface SectionHeader {
    type: 'SECTION_HEADER';
}

export interface Row {
    type: 'ROW';
    index: number;
}

export interface SectionFooter {
    type: 'SECTION_FOOTER';
}

export interface Parameters {
    getItemHeight: (rowData?: any, sectionIndex?: number, rowIndex?: number) => number;
    getSeparatorHeight?: (sectionIndex?: number, rowIndex?: number) => number;
    getSectionHeaderHeight?: (sectionIndex: number) => number;
    getSectionFooterHeight?: (sectionIndex: number) => number;
    listHeaderHeight?: () => number;
    listFooterHeight?: () => number;
}

export type ListElement = SectionHeader | Row | SectionFooter;

/**
 * @see https://reactnative.dev/docs/sectionlist
 */
export type DefaultSectionT = {
    [key: string]: any;
};

export type GetItemLayout<ItemT, SectionT = DefaultSectionT> = Required<
    SectionListProps<ItemT, SectionT>
>['getItemLayout'];

export type SectionListGetItemLayout<ItemT, SectionT = DefaultSectionT> = (
    args: Parameters,
) => GetItemLayout<ItemT, SectionT>;
