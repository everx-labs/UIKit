// @flow
import React from 'react';
import { View } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from "@tonlabs/uikit.core";
import { UIComponent } from "@tonlabs/uikit.components";
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIAccountPickerCell from './components/UIAccountPickerCell';
import type { UIAccountData } from './types/UIAccountData';

type Props = {
    title: string,
    account: UIAccountData,
    decimalSeparator?: string, // used for localize account balance
    onPressAccount?: () => void,
    containerStyle: ViewStyleProp,
    displayNameOnly?: boolean,
    notActive?: boolean,
    tokenSymbol?: string | React$Element<any>,
    hideBalance?: boolean,
};
type State = {
    // Empty
};

export default class UIAccountPicker extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        account: null,
        decimalSeparator: '.',
        onPressAccount: () => {},
        displayNameOnly: false,
        notActive: false,
        tokenSymbol: '',
        hideBalance: false,
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
        const {
            account,
            decimalSeparator,
            onPressAccount,
            displayNameOnly,
            notActive,
            tokenSymbol,
            hideBalance,
        } = this.props;

        if (!account) {
            return null;
        }

        return (
            <UIAccountPickerCell
                account={account}
                decimalSeparator={decimalSeparator}
                onPress={onPressAccount}
                displayNameOnly={displayNameOnly}
                notActive={notActive}
                tokenSymbol={tokenSymbol}
                hideBalance={hideBalance}
            />
        );
    }

    render() {
        const title = this.props.title || 'default';
        return (
            <View
                testID={`rebalance_asset_picker_${title}`}
                style={this.props.containerStyle}
            >
                {this.renderTitle()}
                {this.renderAccountCell()}
            </View>
        );
    }
}
