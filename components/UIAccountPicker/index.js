// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import UIAccountPickerCell from './components/UIAccountPickerCell';

import UIComponent from '../UIComponent';
import UITextStyle from '../../helpers/UITextStyle';
import UIColor from '../../helpers/UIColor';

import type { UIAccountData } from './types/UIAccountData';

export type {
    UIAccountData,
};

type Props = {
    title: string,
    account: UIAccountData,
    onPressAccount?: () => void,
};
type State = {
    // Empty
};

const styles = StyleSheet.create({
    title: {
        color: UIColor.grey(),
    },
});

export default class UIAccountPicker extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        account: null,
        onPressAccount: () => {},
    };

    renderTitle() {
        const { title } = this.props;

        return (
            <Text style={[UITextStyle.grey1CaptionRegular, styles.title]}>
                {title}
            </Text>
        );
    }

    renderAccountCell() {
        const { account, onPressAccount } = this.props;
        if (!account) return null;

        return (
            <UIAccountPickerCell
                account={account}
                onPress={onPressAccount}
            />
        );
    }

    render() {
        return (
            <View>
                {this.renderTitle()}
                {this.renderAccountCell()}
            </View>
        );
    }
}
