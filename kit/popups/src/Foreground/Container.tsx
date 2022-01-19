import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { ContainerProps, PartStatus } from './types';

export const { Provider: PartStatusProvider, Consumer: PartStatusConsumer } =
    React.createContext<PartStatus>({
        disabled: undefined,
        negative: undefined,
        partType: 'Primary',
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
        marginRight: -UILayoutConstant.contentInsetVerticalX3,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
