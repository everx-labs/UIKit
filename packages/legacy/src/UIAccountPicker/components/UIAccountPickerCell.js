// @flow
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIConstant,
    UIFunction,
    UIStyle,
    UITextStyle,
} from '@uikit/core';
import { UIComponent } from '@uikit/components';

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

        const { primaryBodyRegular, greyBodyRegular } = UITextStyle;

        const [integer, fractional] = stringNumber.split('.');

        const decimals = (fractional && fractional.length > 0)
            ? fractional
            : '0'.repeat(UIConstant.minDecimalDigits());

        const tokenSymbol = this.getTokenSymbol();

        return (
            <Text
                testID={`balance_value_${this.getAccountName()}`}
                style={primaryBodyRegular}
            >
                {integer}
                <Text style={greyBodyRegular}>
                    {`${this.getDecimalSeparator()}${decimals}`}
                    {tokenSymbol ? ' ' : '' /* space between */}
                    {tokenSymbol}
                </Text>
            </Text>
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
                <Text
                    style={[
                        UIStyle.common.flex(),
                        UIStyle.margin.rightDefault(),
                        notActive
                            ? UIStyle.text.secondaryBodyRegular()
                            : UIStyle.text.actionBodyMedium(),
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                >
                    {name}
                </Text>
                {this.renderFractional(UIFunction.getNumberString(account.balance))}
            </View>
        );
    }

    renderFooter() {
        const account = this.getAccount();

        if (!account) {
            return null;
        }

        return (
            <Text style={[UIStyle.margin.topTiny(), UIStyle.text.tertiaryCaptionRegular()]}>
                {account.name}
            </Text>
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
