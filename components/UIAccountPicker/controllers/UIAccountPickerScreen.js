// @flow
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import UIModalController from '../../../controllers/UIModalController';
import UISearchBar from '../../input/UISearchBar';
import UIAccountPickerCell from '../components/UIAccountPickerCell';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';

import type { UIAccountData } from '../types/UIAccountData';
import type { ModalControllerProps } from '../../../controllers/UIModalController';

type Props = ModalControllerProps & {
    onAccountSelect: (account: UIAccountData) => {},
    masterAccountPickerView: boolean,
};

type State = {
    accounts: ?UIAccountData[],
    filteredAccounts: ?UIAccountData[],
    expression: string,
};

const styles = StyleSheet.create({
    cell: {
        marginTop: UIConstant.contentOffset(),
    },
});

let masterRef = null;

class UIAccountPickerScreen extends UIModalController<Props, State> {
    static selectAccount(accounts?: UIAccountData[], onSelectCallback?: () => void) {
        if (masterRef) {
            masterRef.showAccounts(accounts, onSelectCallback);
        }
    }

    onSelectCallback: (account: UIAccountData) => void;

    static defaultProps = {
        onAccountSelect: () => {},
        masterAccountPickerView: true,
    }

    constructor(props: Props) {
        super(props);
        this.hasSpinnerOverlay = true;

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

    setSections(sections: SectionsArray) {
        this.setStateSafely({ sections });
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
        this.onSelectCallback(account);
        this.hide();
    }

    onChangeExpression(expression: string) {
        this.setExpression(expression);
        this.filterAccounts(expression);
    }

    // Processing

    // Actions
    showAccounts(accounts: ?UIAccountData[], onSelectCallback?: () => void) {
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
            <View style={styles.cell}>
                <UIAccountPickerCell
                    account={account}
                    onPress={() => {
                        this.onAccountSelect(account);
                    }}
                />
            </View>
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
