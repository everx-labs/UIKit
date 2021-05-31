// @flow
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIComponent } from '@tonlabs/uikit.components';
import { UIStyle } from '@tonlabs/uikit.core';
import { ColorVariants, UIImage } from '@tonlabs/uikit.hydrogen';

type Props = {
    testID: string,
    containerStyle: ViewStyleProp,
    icon: any,
    navigation: Object,
};

type State = {};

/**
 * @deprecated utility for navigation used with react-navigation v2
 *
 * Actual version is for react-navigation v5 - UIReactNavigationBackButton
 */
export default class UINavigationBackButton extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        icon: null,
        navigation: null,
        testID: 'back_btn',
    };

    // Getters
    getNavigation() {
        return this.props.navigation;
    }

    getNavigationParams() {
        return this.props.navigation.state.params;
    }

    getContainerStyle() {
        return this.props.containerStyle;
    }

    getIcon() {
        return this.props.icon;
    }

    // React.Component
    render() {
        const { testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        const params = this.getNavigationParams();
        if (params && params.initialRoute) {
            return (<View />);
        }
        return (
            <TouchableOpacity
                {...testIDProp}
                style={[UIStyle.navigatorButton, this.getContainerStyle()]}
                onPress={() => {
                    this.getNavigation().goBack(null);
                }}
            >
                <UIImage
                    source={this.getIcon() || UIAssets.icons.ui.arrowLeft}
                    tintColor={ColorVariants.LineAccent}
                />
            </TouchableOpacity>
        );
    }
}
