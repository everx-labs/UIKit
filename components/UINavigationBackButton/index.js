import React from 'react';
import StylePropType from 'react-style-proptype';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';
import UIStyle from '../../helpers/UIStyle';

const backImage = require('../../assets/ico-arrow-left/ico-arrow-left.png');

export default class UINavigationBackButton extends React.Component {
    static propTypes = {
        containerStyle: StylePropType,
        icon: PropTypes.any,
        navigation: PropTypes.instanceOf(Object),
    };

    static defaultProps = {
        containerStyle: {},
        icon: null,
        navigation: null,
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
        const params = this.getNavigationParams();
        if (params && params.initialRoute) {
            return (<View />);
        }
        return (
            <TouchableOpacity
                style={[UIStyle.navigatorButton, this.getContainerStyle()]}
                onPress={() => {
                    this.getNavigation().goBack(null);
                }}
            >
                <Image source={this.getIcon() || backImage} />
            </TouchableOpacity>
        );
    }
}
