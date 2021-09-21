// Deprecated?
import React from 'react';

import { View, StyleSheet } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    sectionHeader: {
        height: UIConstant.floatingLabelHeight(),
    },
    sectionDivider: {
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
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundPrimary}
                style={[styles.sectionDivider, UIStyle.border.bottom()]}
            />
        );
        return this.props.needBorder ? separator : null;
    }

    render() {
        return (
            <View>
                {this.renderSeparator()}
                <UIBackgroundView
                    color={UIBackgroundViewColors.BackgroundPrimary}
                    style={[
                        UIStyle.flex.row(),
                        UIStyle.flex.justifySpaceBetween(),
                        UIStyle.container.centerLeft(),
                        styles.sectionHeader,
                        this.props.containerStyle,
                    ]}
                >
                    <UILabel color={UILabelColors.TextTertiary} role={UILabelRoles.HeadlineLabel}>
                        {this.getTitle()}
                    </UILabel>
                    <UILabel color={UILabelColors.TextTertiary} role={UILabelRoles.ParagraphLabel}>
                        {this.getTitleRight()}
                    </UILabel>
                </UIBackgroundView>
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
