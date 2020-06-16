// @flow
import React from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import UIComponent from '../../UIComponent';

import icoInactive from '../../../assets/ico-toggle-inactive/ico-toggle-inactive.png';
import icoActive from '../../../assets/ico-toggle-active/ico-toggle-active.png';
import icoOn from '../../../assets/ico-toggle-on/ico-toggle-on.png';
import icoOff from '../../../assets/ico-toggle-off/ico-toggle-off.png';

type Props = {
    iconActive: ?ImageSource,
    iconInactive: ?ImageSource,
    containerStyle: ViewStyleProp,
    active: boolean,
    colored: boolean,
    onPress: boolean => void,
    testID: ?string,
};

export default class UIToggle extends UIComponent<Props, {}> {
    static defaultProps: Props = {
        containerStyle: {},
        active: false,
        colored: false,
        onPress: () => {},
        testID: null,
        iconActive: null,
        iconInactive: null,
    };

    // Events
    onPress = () => {
        const { active, onPress } = this.props;
        onPress(!active);
    };

    // Render
    renderIcon() {
        const {
            active, colored, iconActive, iconInactive,
        } = this.props;
        let source;
        if (colored) {
            source = active ? (iconActive || icoOn) : (iconInactive || icoOff);
        } else {
            source = active ? (iconActive || icoActive) : (iconInactive || icoInactive);
        }
        return (<Image source={source} />);
    }

    render() {
        const { containerStyle, testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <View style={containerStyle}>
                <TouchableWithoutFeedback
                    {...testIDProp}
                    onPress={this.onPress}
                >
                    {this.renderIcon()}
                </TouchableWithoutFeedback>
            </View>
        );
    }
}
