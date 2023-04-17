import * as React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import type { ZoomProps } from '../types';

export function Zoom({ children, onClose }: ZoomProps) {
    return (
        <View style={StyleSheet.absoluteFill}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.underlay} />
            </TouchableWithoutFeedback>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    underlay: {
        ...StyleSheet.absoluteFillObject,
        cursor: 'pointer',
    },
});
