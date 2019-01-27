import React from 'react';
import { View, StyleSheet } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';

const styles = StyleSheet.create({
    iconContainer: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        backgroundColor: UIColor.success(),
        width: 4,
        height: 4,
        borderRadius: UIConstant.tinyBorderRadius(),
    },
});

const UIDot = () => {
    return (
        <View style={styles.iconContainer}>
            <View style={styles.circle} />
        </View>
    );
};

export default UIDot;
