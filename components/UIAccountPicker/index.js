// @flow
import React from 'react';
import { View, Text } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIAccountPickerCell from './components/UIAccountPickerCell';

import UIComponent from '../UIComponent';
import UIStyle from '../../helpers/UIStyle';
import UITextStyle from '../../helpers/UITextStyle';

import type { UIAccountData } from './types/UIAccountData';

type Props = {
    title: string,
    account: UIAccountData,
    decimalSeparator?: string, // used for localize account balance
    onPressAccount?: () => void,
    containerStyle: ViewStyleProp,
    displayNameOnly?: boolean,
    notActive?: boolean,
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
    };

    renderTitle() {
        return (
            <Text style={[UITextStyle.tertiaryTinyRegular, UIStyle.marginBottomTiny]}>
                {this.props.title}
            </Text>
        );
    }

    renderAccountCell() {
        const {
            account,
            decimalSeparator,
            onPressAccount,
            displayNameOnly,
            notActive,
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
