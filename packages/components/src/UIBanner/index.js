// @flow
import React from 'react';

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
};

type State = {};

export default class UIBanner extends UIComponent<Props, State> {
    render() {
        return (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundNegative}
                style={[
                    UIStyle.margin.topSmall(),
                    UIStyle.margin.bottomSmall(),
                    UIStyle.margin.leftDefault(),
                    UIStyle.margin.rightDefault(),
                    UIStyle.padding.verticalNormal(),
                    UIStyle.padding.horizontalNormal(),
                    UIStyle.border.radiusDefault(),
                    { display: this.props.text ? 'flex' : 'none' },
                ]}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextPrimaryInverted}
                >
                    {this.props.text || ''}
                </UILabel>
            </UIBackgroundView>
        );
    }
}
