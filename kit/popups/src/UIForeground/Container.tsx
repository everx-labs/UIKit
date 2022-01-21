import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { ContainerProps, ColumnStatus } from './types';

export const ColumnStatusContext = React.createContext<ColumnStatus>({
    disabled: undefined,
    negative: undefined,
    columnType: 'Primary',
    columnState: 'NonPressable',
});

export function Container({ children }: ContainerProps) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        /**
         * The negative right margin is used to set the right padding of all child elements
         * and not to think about the presence of an element on the right side.
         */
        marginHorizontal: -UILayoutConstant.contentInsetVerticalX3 / 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
