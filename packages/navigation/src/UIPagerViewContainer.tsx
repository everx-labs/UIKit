import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { IUIPagerViewContainerProps } from './UIPagerView';

export const UIPagerViewContainer: React.FC<IUIPagerViewContainerProps> = (
    props: IUIPagerViewContainerProps,
) => {
    // TODO
    return <View style={styles.container} testID={props.testID} />;
};

const styles = StyleSheet.create({
    container: {
        // TODO
    },
});
