// Is it deprecated?
import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { Image, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import { UIColor } from '@uikit/core';
import { UIComponent } from '@uikit/components';
import icoSquareCheckboxActive
    from '@uikit/assets/ico-checkbox-square-active/ico-checkbox-square-active.png';
import icoSquareCheckboxInactive
    from '@uikit/assets/ico-checkbox-square-inactive/ico-checkbox-square-inactive.png';
import icoSquareCheckboxActiveAction
    from '@uikit/assets/ico-checkbox-square-active/active-action.png';
import icoSquareCheckboxInactiveAction
    from '@uikit/assets/ico-checkbox-square-inactive/inactive-action.png';
import icoCircleCheckboxActive
    from '@uikit/assets/ico-checkbox-circle-active/ico-checkbox-circle-active-inverted.png';
import icoCircleCheckboxInactive
    from '@uikit/assets/ico-checkbox-circle-inactive/ico-checkbox-circle-inactive-empty.png';

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
                return selected ? icoSquareCheckboxActiveAction : icoSquareCheckboxInactiveAction;
            }
            return selected ? icoSquareCheckboxActive : icoSquareCheckboxInactive;
        }
        return selected ? icoCircleCheckboxActive : icoCircleCheckboxInactive;
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
