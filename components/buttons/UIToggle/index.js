import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { View, Image, TouchableWithoutFeedback } from 'react-native';

import icoInactive from '../../../assets/ico-toggle-inactive/ico-toggle-inactive.png';
import icoActive from '../../../assets/ico-toggle-active/ico-toggle-active.png';
import icoOn from '../../../assets/ico-toggle-on/ico-toggle-on.png';
import icoOff from '../../../assets/ico-toggle-off/ico-toggle-off.png';

export default class UIToggle extends Component {
    // Render
    renderIcon() {
        const { active, colored } = this.props;
        let source;
        if (colored) {
            source = active ? icoOn : icoOff;
        } else {
            source = active ? icoActive : icoInactive;
        }
        return (<Image source={source} />);
    }

    render() {
        const { containerStyle, active, onPress } = this.props;
        return (
            <View style={containerStyle}>
                <TouchableWithoutFeedback onPress={() => onPress(!active)}>
                    {this.renderIcon()}
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

UIToggle.defaultProps = {
    containerStyle: {},
    active: false,
    colored: false,
    onPress: () => {},
};

UIToggle.propTypes = {
    containerStyle: StylePropType,
    active: PropTypes.bool,
    colored: PropTypes.bool,
    onPress: PropTypes.func,
};
