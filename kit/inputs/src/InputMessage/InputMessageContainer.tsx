import * as React from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import type { InputMessageContainerProps } from './types';

export function InputMessageContainer({
    children,
    message,
}: InputMessageContainerProps): JSX.Element {
    React.useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [message]);

    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});
