import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
//
});

class UIHeader extends UIComponent {
    // Getters
    getTitle() {
        return this.props.title;
    }

    // Render
    render() {
        return (
            <View
                style={this.props.containerStyle}
            >
                <Text style={[UITextStyle.primaryTitleBold, UIStyle.Margin.topMedium()]}>
                    {this.getTitle()}
                </Text>
            </View>
        );
    }
}

export default UIHeader;

UIHeader.defaultProps = {
    title: '',
    containerStyle: null,
};

UIHeader.propTypes = {
    title: PropTypes.string,
    containerStyle: StylePropType,
};
