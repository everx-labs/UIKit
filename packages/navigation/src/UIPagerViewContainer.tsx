import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { UIPagerViewContainerProps } from './UIPagerView';

export const UIPagerViewContainer: React.FC<UIPagerViewContainerProps> = (
    props: UIPagerViewContainerProps,
) => {
    // TODO
    return <View style={styles.container} testID={props.testID} />;
};

const styles = StyleSheet.create({
    container: {
        // TODO
    },
});
