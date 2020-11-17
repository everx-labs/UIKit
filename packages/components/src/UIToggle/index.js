// @flow
import React from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import { UIAssets } from '@tonlabs/uikit.assets';

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
            source = active
                ? iconActive || UIAssets.icons.ui.toggleOn
                : iconInactive || UIAssets.icons.ui.toggleOff;
        } else {
            source = active
                ? iconActive || UIAssets.icons.ui.toggleActive
                : iconInactive || UIAssets.icons.ui.toggleInactive;
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
