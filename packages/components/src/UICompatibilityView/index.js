// @flow
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Bowser from 'bowser';

import {
    UIStyle,
    UITextStyle,
} from '@uikit/core';

import { uiLocalized } from '@tonlabs/uikit.localization';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class UICompatibilityView extends UIComponent<null, null> {
    static renderNotCompatible() {
        return (
            <Text style={UITextStyle.primaryBodyRegular}>
                {uiLocalized.WeAreSorryButYourBrowserVersionIsNotCompatible}
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
