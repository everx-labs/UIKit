import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
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
    detailsText: {
        marginRight: UIConstant.contentOffset(),
    },
    flexGrow1: {
        flexGrow: 1,
    },
    flexGrow0: {
        flexGrow: 0,
    },
});

class UITextButton extends UIComponent {
    // Render
    renderTitle() {
        const {
            title, textStyle, details, disabled,
        } = this.props;
        const defaultTitleStyle = disabled
            ? UITextStyle.secondarySmallMedium
            : UITextStyle.actionSmallMedium;
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;
        return (
            <Text style={[defaultTitleStyle, textStyle, flexGrow]}>
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
            <Text style={[UITextStyle.secondarySmallRegular, detailsStyle]}>
                {details}
            </Text>
        );
    }

    render() {
        const {
            testID, buttonStyle, onPress, disabled,
        } = this.props;
        return (
            <TouchableOpacity
                testID={testID}
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
    onPress: () => {
    },
};

UITextButton.propTypes = {
    testID: String,
    buttonStyle: StylePropType,
    textStyle: StylePropType,
    detailsStyle: StylePropType,
    title: PropTypes.string,
    details: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
};
