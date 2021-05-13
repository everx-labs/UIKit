import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { UIPagerViewPageProps } from './UIPagerView';

export const UIPagerViewPage: React.FC<UIPagerViewPageProps> = (
    props: UIPagerViewPageProps,
) => {
    // TODO
    return <View style={styles.container} testID={props.testID} />;
};

const styles = StyleSheet.create({
    container: {
        // TODO
    },
});
