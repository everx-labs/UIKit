import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { IUIPagerViewPageProps } from './UIPagerView';

export const UIPagerViewPage: React.FC<IUIPagerViewPageProps> = (
    props: IUIPagerViewPageProps,
) => {
    // TODO
    return <View style={styles.container} testID={props.testID} />;
};

const styles = StyleSheet.create({
    container: {
        // TODO
    },
});
