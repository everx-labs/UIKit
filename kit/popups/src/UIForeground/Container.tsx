import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { ContainerProps } from './types';
import * as Columns from './Columns';
import { useCheckChildren } from './hooks';

export function Container({ children, id }: ContainerProps) {
    const isValid = useCheckChildren(
        children,
        Columns,
        `'Container' can only contain 'Column' components as its direct children`,
    );
    if (!isValid) {
        return null;
    }
    return (
        <View key={id} style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        /**
         * The negative horizontal margin is used to set the horizontal padding of all child elements
         * and not to think about the presence of an element on the left or right side.
         */
        marginHorizontal: -UILayoutConstant.normalContentOffset / 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
