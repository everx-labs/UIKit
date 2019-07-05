import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: UIColor.backgroundPrimary(),
        height: UIConstant.floatingLabelHeight(), // UIConstant.smallButtonHeight(),
    },
    sectionDivider: {
        backgroundColor: UIColor.backgroundPrimary(),
        height: 16, // TODO: why so?
    },
});

class UISectionHeader extends UIComponent {
    // Getters
    getTitle() {
        return this.props.title;
    }

    getTitleRight() {
        return this.props.titleRight;
    }

    // Render
    renderSeparator() {
        const separator = (
            <View style={[styles.sectionDivider, UIStyle.borderBottom]} />
        );
        return this.props.needBorder ? separator : null;
    }

    render() {
        return (
            <View>
                {this.renderSeparator()}
                <View
                    style={[
                        UIStyle.flexRow,
                        UIStyle.justifySpaceBetween,
                        UIStyle.centerLeftContainer,
                        styles.sectionHeader,
                        this.props.containerStyle,
                    ]}
                >
                    <Text style={UITextStyle.tertiaryTinyBold}>
                        {this.getTitle()}
                    </Text>
                    <Text style={UITextStyle.tertiaryTinyRegular}>
                        {this.getTitleRight()}
                    </Text>
                </View>
            </View>
        );
    }
}

export default UISectionHeader;

UISectionHeader.defaultProps = {
    title: '',
    titleRight: '',
    needBorder: false,
    containerStyle: null,
};

UISectionHeader.propTypes = {
    title: PropTypes.string,
    titleRight: PropTypes.string,
    needBorder: PropTypes.bool,
    containerStyle: StylePropType,
};
