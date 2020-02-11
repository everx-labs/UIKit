// @flow
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';

import UIConstant from '../../../helpers/UIConstant';
import UIFunction from '../../../helpers/UIFunction';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

import type { UIAccountData } from '../types/UIAccountData';

type Props = {
    containerStyle: ViewStyleProp,
    account: ?UIAccountData,
    maxDecimals: number,
    onPress?: () => void,
    displayNameOnly?: boolean,
    notActive?: boolean,
};

type State = {
    selected: number,
};

export default class UIAccountPickerCell extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        account: null,
        maxDecimals: UIConstant.maxDecimalDigits(),
        onPress: () => {},
        displayNameOnly: false,
        notActive: false,
    };

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            selected: -1,
        };
    }

    // Getters
    getAccount(): UIAccountData {
        return this.props.account;
    }

    getMaxDecimals(): number {
        return this.props.maxDecimals;
    }

    getAccountName(): string {
        const { displayNameOnly } = this.props;
        const { name, address } = this.getAccount();

        if (displayNameOnly) {
            return name || address;
        }

        return address;
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
        return (
            <Text
                testID={`balance_value_${this.getAccountName()}`}
                style={primaryBodyRegular}
            >
                {integer}
                <Text style={greyBodyRegular}>
                    {`.${decimals}`}
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
