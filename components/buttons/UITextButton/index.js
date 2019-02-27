// @flow
import React from 'react';
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

type Props = {
    testID?: string,
    buttonStyle?: StylePropType,
    textStyle?: StylePropType,
    detailsStyle?: StylePropType,
    title: string,
    details: string,
    disabled: boolean,
    onPress: () => void,
};

type State = {};

class UITextButton extends UIComponent<Props, State> {
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
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableOpacity
                {...testIDProp}
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

    static defaultProps: Props;
}

export default UITextButton;

UITextButton.defaultProps = {
    title: '',
    details: '',
    disabled: false,
    onPress: () => {
    },
};
