// @flow
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
// TODO: we have `mobile-detect` in UIDevice
// maybe use only one lib for
import Bowser from 'bowser';

import UICompatibilityViewCommon from './UICompatibilityViewCommon';

export default class UICompatibilityView extends React.Component<*> {
    render() {
        if (!Bowser.msie) {
            return null;
        }
        return <UICompatibilityViewCommon />;
    }
}
