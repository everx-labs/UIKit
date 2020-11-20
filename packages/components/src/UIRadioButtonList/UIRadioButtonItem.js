import React from 'react';
import PropTypes from 'prop-types';

import {
    TouchableWithoutFeedback,
    View,
    Image,
    Text,
    StyleSheet,
} from 'react-native';

import { UIConstant, UIStyle, UITextStyle } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    radiobuttonItem: {
        height: UIConstant.buttonHeight(),
    },
});

class UIRadioButtonItem extends UIComponent {
    renderActiveItem() {
        const { marginRightDefault, centerLeftContainer } = UIStyle;
        return (
            <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
                <View style={[styles.radiobuttonItem, centerLeftContainer]}>
                    <Image
                        source={
                            this.props.iconActive ||
                            UIAssets.icons.ui.radioButtonActive
                        }
                        style={this.props.radioStyle || marginRightDefault}
                    />
                    <Text style={UITextStyle.primaryBodyRegular}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderInactiveItem() {
        const { marginRightDefault, centerLeftContainer } = UIStyle;
        return (
            <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
                <View style={[styles.radiobuttonItem, centerLeftContainer]}>
                    <Image
                        source={
                            this.props.iconInactive ||
                            UIAssets.icons.ui.radioButtonInactive
                        }
                        style={this.props.radioStyle || marginRightDefault}
                    />
                    <Text style={UITextStyle.primaryBodyRegular}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return this.props.selected ? this.renderActiveItem() : this.renderInactiveItem();
    }
}

export default UIRadioButtonItem;

UIRadioButtonItem.defaultProps = {
    selected: false,
    title: '',
    onPress: () => {},
    iconInactive: null,
    iconActive: null,
    radioStyle: null,
};

UIRadioButtonItem.propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
    onPress: PropTypes.func,
    iconInactive: PropTypes.string,
    iconActive: PropTypes.string,
    radioStyle: PropTypes.any,
};
