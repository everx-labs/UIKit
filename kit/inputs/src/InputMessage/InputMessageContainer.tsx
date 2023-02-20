import * as React from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import type { InputMessageContainerProps } from './types';

/**
 * It's required only for web.
 */
export function InputMessageContainer({
    children,
    style,
    message,
}: InputMessageContainerProps): JSX.Element {
    React.useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [message]);

    return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});
