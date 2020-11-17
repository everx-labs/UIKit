// Is it deprecated?
import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { Image, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import { UIColor } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';

import UIComponent from '../UIComponent';

const checkboxSize = 24;

const styles = StyleSheet.create({
    checkboxImage: {
        width: checkboxSize,
        height: checkboxSize,
    },
});
class UICheckboxItem extends UIComponent {
    static Type = {
        Square: 'square',
        Circle: 'circle',
    };

    getOpacity() {
        return this.props.editable ? 1 : 0.3;
    }

    getImage() {
        const {
            type, selected, iconActive, iconInactive,
        } = this.props;
        if (iconActive && selected) return iconActive;
        if (iconInactive && !selected) return iconInactive;

        if (type === UICheckboxItem.Type.Square) {
            if (this.props.theme === UIColor.Theme.Action) {
                return selected
                    ? UIAssets.icons.ui.checkboxSquareActiveAction
                    : UIAssets.icons.ui.checkboxSquareInactiveAction;
            }
            return selected
                ? UIAssets.icons.ui.checkboxSquareActive
                : UIAssets.icons.ui.checkboxSquareInactive;
        }
        return selected
            ? UIAssets.icons.ui.checkboxCircleActiveInverted
            : UIAssets.icons.ui.checkboxCircleInactiveEmpty;
    }

    renderCheckbox() {
        return (
            <Image
                style={[
                    styles.checkboxImage,
                    { opacity: this.getOpacity() },
                ]}
                source={this.getImage()}
            />
        );
    }

    render() {
        const { onPress, editable, containerStyle } = this.props;
        if (onPress && editable) {
            return (
                <View style={containerStyle}>
                    <TouchableWithoutFeedback onPress={onPress}>
                        {this.renderCheckbox()}
                    </TouchableWithoutFeedback>
                </View>
            );
        }
        return (
            <View style={containerStyle}>
                {this.renderCheckbox()}
            </View>
        );
    }
}

export default UICheckboxItem;

UICheckboxItem.defaultProps = {
    containerStyle: null,
    selected: false,
    editable: true,
    type: UICheckboxItem.Type.Square,
    onPress: null,
    theme: UIColor.Theme.Light,
    iconActive: null,
    iconInactive: null,
};

UICheckboxItem.propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.bool,
    editable: PropTypes.bool,
    type: PropTypes.string,
    onPress: PropTypes.func,
    containerStyle: StylePropType,
    iconActive: PropTypes.string,
    iconInactive: PropTypes.string,
};
