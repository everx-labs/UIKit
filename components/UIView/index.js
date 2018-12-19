import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        margin: -16,
        padding: 16,
    },
});

// need this component only for styleguide
const UIView = props => (
    <View style={styles.container}>
        {props.children}
    </View>
);

export default UIView;
