// @flow
import React from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import icoInactive from '@uikit/assets/ico-toggle-inactive/ico-toggle-inactive.png';
import icoActive from '@uikit/assets/ico-toggle-active/ico-toggle-active.png';
import icoOn from '@uikit/assets/ico-toggle-on/ico-toggle-on.png';
import icoOff from '@uikit/assets/ico-toggle-off/ico-toggle-off.png';

import UIComponent from '../UIComponent';

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
    renderIcon(): React$Element<any> {
        const {
            active, colored, iconActive, iconInactive,
        } = this.props;
        let source;
        if (colored) {
            source = active ? (iconActive || icoOn) : (iconInactive || icoOff);
        } else {
            source = active ? (iconActive || icoActive) : (iconInactive || icoInactive);
        }

        return <Image source={source} />;
    }

    render() {
        const { containerStyle, testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        const element = this.renderIcon();

        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                onPress={this.onPress}
            >
                <View style={containerStyle}>
                    {React.cloneElement(element, {
                        style: [element.props.style, {
                            cursor: 'pointer',
                            touchAction: 'manipulation',
                        }],
                    })}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
