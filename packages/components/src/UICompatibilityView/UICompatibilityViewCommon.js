// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { UIStyle, UITextStyle } from '@tonlabs/uikit.core';

import { uiLocalized } from '@tonlabs/uikit.localization';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class UICompatibilityViewCommon extends UIComponent<null, null> {
    renderNotCompatible() {
        return (
            <Text style={UITextStyle.primaryBodyRegular}>
                {uiLocalized.WeAreSorryButYourBrowserVersionIsNotCompatible}
            </Text>
        );
    }

    render() {
        return (
            <View style={[UIStyle.screenBackground, styles.container]}>
                {this.renderNotCompatible()}
            </View>
        );
    }
}
