import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import UIConstant from '../UIConstant';
import UIColor from '../UIColor';
import UIFont from '../UIFont';

const styles = StyleSheet.create({
    contentStyle: {
        paddingHorizontal: UIConstant.contentOffset(),
    },
    titleStyle: {
        color: UIColor.fa(),
        ...UIFont.captionRegular(),
    },
});

export default class UIToastMessage extends Component {
    static showMessage(message, description, callback) {
        showMessage({
            message,
            description,
            type: 'default',
            backgroundColor: UIColor.dark(),
            onPress: callback,
        });
    }

    render() {
        return (<FlashMessage
            floating
            position="top"
            style={styles.contentStyle}
            titleStyle={styles.titleStyle}
        />);
    }
}
