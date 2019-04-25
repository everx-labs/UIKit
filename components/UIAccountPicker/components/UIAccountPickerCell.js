// @flow
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';

import type { UIAccountData } from '../types/UIAccountData';

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flexDirection: 'column',
    },
    accountInfoContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    accountAddress: {
        marginRight: UIConstant.contentOffset(),
    },
    footer: {
        color: UIColor.grey(),
    },
});

type Props = {
    account: UIAccountData,
    onPress?: () => void,
};

type State = {
    selected: number,
};

export default class UIAccountPickerCell extends UIComponent<Props, State> {
    static defaultProps = {
        account: null,
        onPress: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            selected: -1,
        };
    }

    renderFractional(stringNumber: string) {
        if (!stringNumber) {
            return null;
        }
        const { primaryBodyRegular, secondaryBodyRegular } = UITextStyle;
        const [integer, fractional] = stringNumber.split('.');
        const decimals = (fractional && fractional.length > 0) ? fractional : '0000';
        return (
            <Text style={primaryBodyRegular}>
                {integer}
                <Text style={secondaryBodyRegular}>
                    {`.${decimals}`}
                </Text>
            </Text>
        );
    }

    renderAccount() {
        const { account } = this.props;
        if (!account) return null;

        return (
            <View style={styles.accountInfoContainer}>
                <Text
                    style={[UITextStyle.actionBodyMedium, styles.accountAddress]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                >
                    {account.address}
                </Text>
                {this.renderFractional(account.balance.toString())}
            </View>
        );
    }

    renderFooter() {
        const { account } = this.props;
        if (!account) return null;

        return (
            <Text style={[UITextStyle.grey1CaptionRegular, styles.footer]}>
                {account.name}
            </Text>
        );
    }

    render() {
        const { onPress } = this.props;
        return (
            <TouchableOpacity
                style={styles.mainContainer}
                onPress={onPress}
            >
                {this.renderAccount()}
                {this.renderFooter()}
            </TouchableOpacity>
        );
    }
}
