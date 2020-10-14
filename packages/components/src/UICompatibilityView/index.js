// @flow
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Bowser from 'bowser';

import {
    UIStyle,
    UITextStyle,
    UILocalized,
} from '@uikit/core';
import { UIComponent } from '@uikit/components';

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
