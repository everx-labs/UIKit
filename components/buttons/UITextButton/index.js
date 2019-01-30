import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIFontStyle from '../../../helpers/UIFontStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    textButton: {
        height: UIConstant.buttonHeight(),
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleText: {
        color: UIColor.primary(),
        ...UIFont.smallMedium(),
    },
    detailsText: {
        marginRight: UIConstant.contentOffset(),
    },
});

class UITextButton extends UIComponent {
    // Render
    textSecondary
    renderTitle() {
        const {
            title, textStyle, details, disabled,
        } = this.props;
        const defaultTitleStyle = disabled ? UIFontStyle.secondarySmallMedium : styles.titleText;
        return (
            <Text style={[defaultTitleStyle, textStyle, { flexGrow: details ? 1 : 0 }]}>
                {title}
            </Text>
        );
    }

    renderDetails() {
        const { details, detailsStyle } = this.props;
        if (!details || !details.length) {
            return null;
        }
        return (
            <Text style={[UIFontStyle.secondarySmallRegular, detailsStyle]}>
                {details}
            </Text>
        );
    }

    render() {
        const { buttonStyle, onPress, disabled } = this.props;
        return (
            <TouchableOpacity
                style={[
                    styles.textButton,
                    buttonStyle,
                ]}
                disabled={disabled}
                onPress={() => onPress()}
            >
                {this.renderTitle()}
                {this.renderDetails()}
            </TouchableOpacity>
        );
    }
}

export default UITextButton;

UITextButton.defaultProps = {
    buttonStyle: {},
    textStyle: {},
    detailsStyle: {},
    title: '',
    details: '',
    disabled: false,
    onPress: () => {},
};

UITextButton.propTypes = {
    buttonStyle: StylePropType,
    textStyle: StylePropType,
    detailsStyle: StylePropType,
    title: PropTypes.string,
    details: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
};
