// Deprecated?
import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet } from 'react-native';

import { UIStyle, UIColor, UIConstant } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: UIColor.backgroundPrimary(),
        height: UIConstant.floatingLabelHeight(),
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
                        UIStyle.flex.row(),
                        UIStyle.flex.justifySpaceBetween(),
                        UIStyle.container.centerLeft(),
                        styles.sectionHeader,
                        this.props.containerStyle,
                    ]}
                >
                    <UILabel
                        color={UILabelColors.TextTertiary}
                        role={UILabelRoles.HeadlineLabel}
                    >
                        {this.getTitle()}
                    </UILabel>
                    <UILabel
                        color={UILabelColors.TextTertiary}
                        role={UILabelRoles.ParagraphLabel}
                    >
                        {this.getTitleRight()}
                    </UILabel>
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
