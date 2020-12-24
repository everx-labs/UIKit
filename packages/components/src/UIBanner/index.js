// @flow
import React from 'react';
import {
    StyleSheet, View,
} from 'react-native';

import { UIConstant, UIColor, UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

type Props = {
    text: ?string,
};

type State = {};

const styles = StyleSheet.create({
    containerStyle: {
        marginTop: UIConstant.smallContentOffset(),
        marginBottom: UIConstant.smallContentOffset(),
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
        padding: UIConstant.normalContentOffset(),
        borderRadius: UIConstant.borderRadius(),
    },
});

export default class UIBanner extends UIComponent<Props, State> {
    render() {
        return (
            <View
                style={[
                    styles.containerStyle,
                    UIStyle.color.getBackgroundColorStyle(UIColor.backgroundNegative()),
                    { display: this.props.text ? 'flex' : 'none' },
                ]}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextPrimaryInverted}
                >
                    {this.props.text || ''}
                </UILabel>
            </View>
        );
    }
}
