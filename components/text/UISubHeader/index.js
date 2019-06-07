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

class UISubHeader extends UIComponent {
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
                <Text style={[UIStyle.Text.primarySubtitleBold(), UIStyle.Margin.topDefault()]}>
                    {this.getTitle()}
                </Text>
            </View>
        );
    }
}

export default UISubHeader;

UISubHeader.defaultProps = {
    title: '',
    containerStyle: null,
};

UISubHeader.propTypes = {
    title: PropTypes.string,
    containerStyle: StylePropType,
};
