// @flow
import React from 'react';
import { View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIComponent } from '@tonlabs/uikit.components';
import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIAccountPickerCell from './components/UIAccountPickerCell';
import type { UIAccountData } from './types/UIAccountData';

type Props = {
    title: string,
    account: UIAccountData,
    onPressAccount?: () => void,
    containerStyle: ViewStyleProp,
    displayNameOnly?: boolean,
    notActive?: boolean,
    right?: React$Element<any>,
};
type State = {
    // Empty
};

export default class UIAccountPicker extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        account: null,
        onPressAccount: () => {},
        displayNameOnly: false,
    };

    renderTitle() {
        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphLabel}
                style={UIStyle.margin.bottomTiny()}
            >
                {this.props.title}
            </UILabel>
        );
    }

    renderAccountCell() {
        const { account, onPressAccount, displayNameOnly, right, notActive } = this.props;

        if (!account) {
            return null;
        }

        return (
            <UIAccountPickerCell
                account={account}
                onPress={onPressAccount}
                displayNameOnly={displayNameOnly}
                notActive={notActive}
                right={right}
            />
        );
    }

    render() {
        const title = this.props.title || 'default';
        return (
            <View testID={`rebalance_asset_picker_${title}`} style={this.props.containerStyle}>
                {this.renderTitle()}
                {this.renderAccountCell()}
            </View>
        );
    }
}
