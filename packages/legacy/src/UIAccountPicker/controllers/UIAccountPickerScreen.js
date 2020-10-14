// @flow
import React from 'react';
import { View, FlatList } from 'react-native';

import { UIStyle, UILocalized } from '@uikit/core';
import { UIModalController } from '@uikit/navigation';
import type { ModalControllerProps } from '@uikit/navigation/UIModalController';
import { UISearchBar } from '@uikit/components';

import UIAccountPickerCell from '../components/UIAccountPickerCell';
import type { UIAccountData } from '../types/UIAccountData';

type SelectAccountCallback = (account: UIAccountData) => void;

type Props = ModalControllerProps & {
    onAccountSelect?: SelectAccountCallback,
    masterAccountPickerView: boolean,
};

type State = {
    accounts: ?UIAccountData[],
    filteredAccounts: ?UIAccountData[],
    expression: string,
};

let masterRef = null;

class UIAccountPickerScreen extends UIModalController<Props, State> {
    static selectAccount(accounts?: UIAccountData[], onSelectCallback?: SelectAccountCallback) {
        if (masterRef) {
            masterRef.showAccounts(accounts, onSelectCallback);
        }
    }

    static defaultProps = {
        masterAccountPickerView: true,
    }

    constructor(props: Props) {
        super(props);
        this.hasSpinnerOverlay = true;
        this.testID = '[UIAccountPickerScreen]';

        this.state = {
            accounts: null,
            filteredAccounts: null,
            expression: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterAccountPickerView) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterAccountPickerView) {
            masterRef = null;
        }
    }

    // Setters
    setExpression(expression: string) {
        this.setStateSafely({ expression });
    }

    setFilteredAccounts(filteredAccounts: UIAccountData) {
        this.setStateSafely({ filteredAccounts });
    }

    // Getters
    getAccounts(): ?UIAccountData[] {
        return this.state.accounts;
    }

    getFilteredAccounts(): ?UIAccountData[] {
        return this.state.filteredAccounts;
    }

    getExpression(): string {
        return this.state.expression;
    }

    // Events
    onAccountSelect(account: UIAccountData) {
        if (this.onSelectCallback) {
            this.onSelectCallback(account);
        }
        this.hide();
    }

    onChangeExpression(expression: string) {
        this.setExpression(expression);
        this.filterAccounts(expression);
    }

    // Processing

    // Actions
    onSelectCallback: ?SelectAccountCallback;
    showAccounts(accounts: ?UIAccountData[], onSelectCallback?: SelectAccountCallback) {
        if (!accounts) return;
        this.onSelectCallback = onSelectCallback || this.props.onAccountSelect;
        this.setStateSafely({
            accounts,
            filteredAccounts: accounts,
        }, () => {
            this.show();
        });
    }
    // Currently thie method is used only for "my" accounts

    filterAccounts(expression: string) {
        if (expression === '') {
            this.setStateSafely({ filteredAccounts: this.getAccounts() });
        } else {
            const accounts = this.getAccounts();
            if (!accounts) return;

            const filtered = accounts.filter((account) => {
                const exp = expression.toLowerCase();
                const name = account.name.toLowerCase();
                const address = account.address.toLowerCase();
                return name.includes(exp) || address.includes(exp);
            });

            this.setStateSafely({ filteredAccounts: filtered });
        }
    }

    // Render
    renderSearchBar() {
        return (
            <UISearchBar
                value={this.getExpression()}
                placeholder={UILocalized.SearchByAccount}
                onChangeExpression={newExpression => this.onChangeExpression(newExpression)}
            />
        );
    }

    renderCell(account: UIAccountData) {
        return (
            <UIAccountPickerCell
                containerStyle={UIStyle.marginTopDefault}
                account={account}
                onPress={() => {
                    this.onAccountSelect(account);
                }}
            />
        );
    }

    renderContentView() {
        return (
            <View style={UIStyle.screenContainer} >
                {this.renderSearchBar()}
                <FlatList
                    style={[UIStyle.screenContainer]}
                    contentContainerStyle={UIStyle.pageContainer}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    data={this.getFilteredAccounts()}
                    renderItem={({ item }) => this.renderCell(item)}
                    keyExtractor={item => item}
                />
            </View>
        );
    }
}

export default UIAccountPickerScreen;
