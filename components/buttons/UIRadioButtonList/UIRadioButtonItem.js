import React from 'react';
import PropTypes from 'prop-types';

import { TouchableWithoutFeedback, View, Image, Text, StyleSheet } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UITextStyle from '../../../helpers/UITextStyle';

import icoRadiobuttonActive from '../../../assets/ico-radiobutton-active/ico-radiobutton-active.png';
import icoRadiobuttonInactive from '../../../assets/ico-radiobutton-inactive/ico-radiobutton-inactive.png';

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
                        source={icoRadiobuttonActive}
                        style={marginRightDefault}
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
                        source={icoRadiobuttonInactive}
                        style={marginRightDefault}
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
};

UIRadioButtonItem.propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
    onPress: PropTypes.func,
};
