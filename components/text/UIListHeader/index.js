import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UIFontStyle from '../../../helpers/UIFontStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    listHeader: {
        backgroundColor: 'transparent',
        height: UIConstant.buttonHeight(),
    },
});

class UIListHeader extends UIComponent {
    // Getters
    getTitle() {
        return this.props.title;
    }

    // Render
    render() {
        return (
            <View
                style={[UIStyle.centerLeftContainer, styles.listHeader, this.props.containerStyle]}
            >
                <Text style={UIFontStyle.primarySmallBold}>
                    {this.getTitle()}
                </Text>
            </View>
        );
    }
}

export default UIListHeader;

UIListHeader.defaultProps = {
    title: '',
    containerStyle: null,
};

UIListHeader.propTypes = {
    title: PropTypes.string,
    containerStyle: StylePropType,
};
