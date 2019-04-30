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
    onPressAccount?: () => void,
    containerStyle: ViewStyleProp,
};
type State = {
    // Empty
};

export default class UIAccountPicker extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        account: null,
        onPressAccount: () => {},
    };

    renderTitle() {
        return (
            <Text style={[UITextStyle.tertiaryTinyRegular, UIStyle.marginBottomTiny]}>
                {this.props.title}
            </Text>
        );
    }

    renderAccountCell() {
        const { account, onPressAccount } = this.props;
        if (!account) {
            return null;
        }
        return (
            <UIAccountPickerCell
                account={account}
                onPress={onPressAccount}
            />
        );
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                {this.renderTitle()}
                {this.renderAccountCell()}
            </View>
        );
    }
}
