// @flow
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { RouteProp } from '@react-navigation/native';

import UIStyle from '../../../helpers/UIStyle';
import UIAssets from '../../../assets/UIAssets';

import UIComponent from '../../UIComponent';

type Props = {
    testID: string,
    containerStyle: ViewStyleProp,
    icon: any,
    navigation: Object,
    route: RouteProp<empty, string>,
};

type State = {};

export default class UIReactNavigationBackButton extends UIComponent<
    Props,
    State,
> {
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
        return this.props.route.params;
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
            return <View />;
        }
        if (!this.getNavigation().canGoBack()) {
            return <View />;
        }
        return (
            <TouchableOpacity
                {...testIDProp}
                style={[UIStyle.navigatorButton, this.getContainerStyle()]}
                onPress={() => {
                    this.getNavigation().goBack(null);
                }}
            >
                <Image source={this.getIcon() || UIAssets.icoArrowLeft()} />
            </TouchableOpacity>
        );
    }
}
