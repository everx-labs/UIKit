import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';

import icoSquareCheckboxActive
    from '../../../assets/ico-checkbox-square-active/ico-checkbox-square-active.png';
import icoSquareCheckboxInactive
    from '../../../assets/ico-checkbox-square-inactive/ico-checkbox-square-inactive.png';

import icoSquareCheckboxActiveAction
    from '../../../assets/ico-checkbox-square-active/active-action.png';
import icoSquareCheckboxInactiveAction
    from '../../../assets/ico-checkbox-square-inactive/inactive-action.png';

import icoCircleCheckboxActive
    from '../../../assets/ico-checkbox-circle-active/ico-checkbox-circle-active.png';
import icoCircleCheckboxInactive
    from '../../../assets/ico-checkbox-circle-inactive/ico-checkbox-circle-inactive.png';

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
        const { type, selected } = this.props;
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
        const { onPress, editable } = this.props;
        if (onPress && editable) {
            return (
                <TouchableWithoutFeedback onPress={onPress}>
                    {this.renderCheckbox()}
                </TouchableWithoutFeedback>
            );
        }
        return this.renderCheckbox();
    }
}

export default UICheckboxItem;

UICheckboxItem.defaultProps = {
    selected: false,
    editable: true,
    type: UICheckboxItem.Type.Square,
    onPress: null,
    theme: UIColor.Theme.Light,
};

UICheckboxItem.propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.bool,
    editable: PropTypes.bool,
    type: PropTypes.string,
    onPress: PropTypes.func,
};
