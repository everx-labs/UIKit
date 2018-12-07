import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Bowser from 'bowser';

import UIStyle from '../UIStyle';
import UILocalized from '../UILocalized';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class UICompatibilityView extends Component {
    static renderNotCompatible() {
        return (
            <Text style={UIStyle.textPrimaryBodyRegular}>
                {UILocalized.WeAreSorryButYourBrowserVersionIsNotCompatible}
            </Text>
        );
    }

    render() {
        if (Platform.OS !== 'web' || !Bowser.msie) {
            return null;
        }
        return (
            <View style={[UIStyle.screenBackground, styles.container]}>
                {UICompatibilityView.renderNotCompatible()}
            </View>
        );
    }
}
