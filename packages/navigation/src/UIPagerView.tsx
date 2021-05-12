import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export type UIPagerViewType = 'Left' | 'Center'

export interface IUIPagerViewPage {
    id: string,
    title: string,
    layout: React.ReactNode,
}

export interface IUIPagerViewProps {
    type: UIPagerViewType;
    pageList: IUIPagerViewPage[];
    initialPageIndex: number;
    onPageIndexChange: (newPageIndex: number) => void;
    testID?: string;
}

export const UIPagerView: React.FC<IUIPagerViewProps> = (props: IUIPagerViewProps) => {
    // TODO
    return (
        <View style={styles.container} testID={props.testID} />
    );
}

const styles = StyleSheet.create({
    container: {
        // TODO
    },
});
