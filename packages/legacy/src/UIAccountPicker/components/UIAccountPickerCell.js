// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIConstant,
    UIStyle,
} from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { UIAccountData } from '../types/UIAccountData';

type Props = {
    containerStyle: ViewStyleProp,
    account: ?UIAccountData,
    decimalSeparator: ?string,
    maxDecimals: number,
    onPress?: () => void,
    displayNameOnly?: boolean,
    notActive?: boolean,
    tokenSymbol?: string | React$Element<any>,
};

type State = {
    selected: number,
};

export default class UIAccountPickerCell extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        account: null,
        decimalSeparator: '.',
        maxDecimals: UIConstant.maxDecimalDigits(),
        onPress: () => {},
        displayNameOnly: false,
        notActive: false,
        tokenSymbol: '',
    };

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            selected: -1,
        };
    }

    // Getters
    getAccount(): ?UIAccountData {
        return this.props.account;
    }

    getDecimalSeparator(): string {
        return this.props.decimalSeparator || '.';
    }

    getMaxDecimals(): number {
        return this.props.maxDecimals;
    }

    getTokenSymbol(): string | React$Element<any> {
        return this.props.tokenSymbol || '';
    }

    getAccountName(): string {
        const { displayNameOnly } = this.props;
        const account = this.getAccount() || {};

        if (displayNameOnly) {
            return account.name || account.address || '';
        }

        return account.address || '';
    }

    // Render
    renderFractional(stringNumber: string) {
        if (!stringNumber) {
            return null;
        }

        const separator = this.getDecimalSeparator();
        const [integer, fractional] = stringNumber.split(separator);

        const decimals = (fractional && fractional.length > 0)
            ? fractional
            : '0'.repeat(UIConstant.minDecimalDigits());

        const tokenSymbol = this.getTokenSymbol();

        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.MonoText}
                testID={`balance_value_${this.getAccountName()}`}
            >
                {integer}
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.MonoText}
                >
                    {`${separator}${decimals}`}
                    {tokenSymbol ? ' ' : '' /* space between */}
                    {tokenSymbol}
                </UILabel>
            </UILabel>
        );
    }

    renderAccount() {
        const { notActive } = this.props;
        const account = this.getAccount();

        if (!account) {
            return null;
        }

        const name = this.getAccountName();

        return (
            <View style={UIStyle.common.flexRow()}>
                <UILabel
                    color={notActive
                        ? UILabelColors.TextPrimary
                        : UILabelColors.TextAccent}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    role={notActive
                        ? UILabelRoles.ParagraphText
                        : UILabelRoles.Action}
                    style={[
                        UIStyle.common.flex(),
                        UIStyle.margin.rightDefault(),
                    ]}
                >
                    {name}
                </UILabel>
                {this.renderFractional(uiLocalized.amountToLocale(account.balance))}
            </View>
        );
    }

    renderFooter() {
        const account = this.getAccount();

        if (!account) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphFootnote}
                style={UIStyle.margin.topTiny()}
            >
                {account.name}
            </UILabel>
        );
    }

    render() {
        const {
            containerStyle,
            onPress,
            displayNameOnly,
            notActive,
        } = this.props;

        return (
            notActive ? (
                <View style={containerStyle}>
                    {this.renderAccount()}
                    {displayNameOnly ? null : this.renderFooter()}
                </View>
            ) : (
                <TouchableOpacity
                    style={containerStyle}
                    onPress={onPress}
                >
                    {this.renderAccount()}
                    {displayNameOnly ? null : this.renderFooter()}
                </TouchableOpacity>
            )
        );
    }
}
