import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
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
        const textStyle = [UIStyle.Margin.topMedium()];
        if (this.props.theme === UIColor.Theme.Action) {
            textStyle.push(UIStyle.Text.primarySubheadBold());
            textStyle.push(UIStyle.Color.textPrimary(this.props.theme));
        } else {
            textStyle.push(UIStyle.Text.primaryTitleBold());
        }

        return (
            <View
                style={this.props.containerStyle}
            >
                <Text style={textStyle}>
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
