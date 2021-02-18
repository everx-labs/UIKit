// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { UIStyle } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

type Props = {
    text: ?string,
    backgroundColor: ?$Values<typeof UIBackgroundViewColors>,
    textColor: ?$Values<typeof UILabelColors>,
    style: StylePropType,
};

type State = {};

export default class UIBanner extends UIComponent<Props, State> {
    // eslint-disable-next-line class-methods-use-this
    getBackgroundColor() {
        return this.props.backgroundColor || UIBackgroundViewColors.BackgroundNegative;
    }

    // eslint-disable-next-line class-methods-use-this
    getTextColor() {
        return this.props.textColor || UILabelColors.TextPrimaryInverted;
    }

    render() {
        const style = [
            UIStyle.margin.topSmall(),
            UIStyle.margin.bottomSmall(),
            UIStyle.padding.verticalNormal(),
            UIStyle.padding.horizontalNormal(),
            UIStyle.border.radiusDefault(),
            { display: this.props.text ? 'flex' : 'none' },
        ];

        return (
            <UIBackgroundView
                color={this.getBackgroundColor()}
                style={[style, this.props.style]}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={this.getTextColor()}
                >
                    {this.props.text || ''}
                </UILabel>
            </UIBackgroundView>
        );
    }
}
