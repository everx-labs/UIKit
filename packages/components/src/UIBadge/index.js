import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const bubbleSize = 20;

const styles = StyleSheet.create({
    container: {
        minWidth: bubbleSize,
        height: bubbleSize,
        borderRadius: bubbleSize / 2.0,
        paddingHorizontal: UIConstant.tinyContentOffset(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        textAlign: 'center',
        letterSpacing: 0,
    },
});

export default class UIBadge extends UIComponent {
    // constructor
    constructor(props) {
        super(props);

        this.state = {
            //
        };
    }

    // Events

    // Setters

    // Getters
    getBackgroundColor() {
        return this.props.inverted
            ? UIBackgroundViewColors.BackgroundPrimary
            : UIBackgroundViewColors.BackgroundAccent;
    }

    getColor() {
        return this.props.inverted
            ? UILabelColors.TextAccent
            : UILabelColors.TextPrimaryInverted;
    }

    // Actions

    // render
    render() {
        const { badge, style, textStyle, allowZero } = this.props;
        if (!allowZero && badge === 0) return null;

        return (
            <UIBackgroundView
                color={this.getBackgroundColor()}
                style={[styles.container, style]}
            >
                <UILabel
                    color={this.getColor()}
                    role={UILabelRoles.ActionLabel}
                    style={[styles.badgeText, textStyle]}
                >
                    {badge}
                </UILabel>
            </UIBackgroundView>
        );
    }
}

UIBadge.defaultProps = {
    style: {},
    textStyle: {},
    badge: 0,
    inverted: false,
    allowZero: false,
};

UIBadge.propTypes = {
    style: StylePropType,
    textStyle: StylePropType,
    badge: PropTypes.number,
    inverted: PropTypes.bool,
    allowZero: PropTypes.bool,
};
