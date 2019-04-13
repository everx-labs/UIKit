// @flow
import React from 'react';

import { FlatList } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UICustomSheet from '../UICustomSheet';
import UIComponent from '../../UIComponent';

import MenuItem from './MenuItem';
import type { MenuItemType } from '../UIMenuView';

type Props = {
    menuItemsList: MenuItemType[],
    needCancelItem: boolean,
    masterActionSheet: boolean,
    onCancel: () => void,
};
type State = {};

let masterRef = null;

export default class UIActionSheet extends UIComponent<Props, State> {
    static show(
        menuItemsList: MenuItemType[],
        needCancelItem?: boolean,
        onCancelCallback?: () => void,
    ) {
        if (masterRef) {
            masterRef.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    }

    static hide(callback: () => void) {
        UICustomSheet.hide(callback);
    }

    onCancel: () => void;
    customSheet: ?UICustomSheet;
    menuItemsList: MenuItemType[];
    needCancelItem: boolean;

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterActionSheet) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterActionSheet) {
            masterRef = null;
        }
    }

    // Setters

    // Getters

    // Actions
    show(
        menuItemsList: MenuItemType[],
        needCancelItem?: boolean = true,
        onCancel?: () => void = () => {},
    ) {
        if (this.props.masterActionSheet) {
            this.menuItemsList = menuItemsList;
            this.needCancelItem = needCancelItem;
            this.onCancel = onCancel;
        } else {
            this.menuItemsList = this.props.menuItemsList;
            this.needCancelItem = this.props.needCancelItem;
            this.onCancel = this.props.onCancel;
        }
        if (this.customSheet) {
            this.customSheet.show();
        }
    }

    // Render
    renderCancelItem(needCancelItem: boolean) {
        if (!needCancelItem) {
            return null;
        }
        return (
            <MenuItem
                title={UILocalized.Cancel}
                onPress={() => UICustomSheet.hide(() => this.onCancel())}
            />
        );
    }

    renderMenuItem(item: MenuItemType) {
        return (
            <MenuItem
                {...item}
                onPress={() => UICustomSheet.hide(() => item.onPress())}
                textStyle={{ color: UIColor.primary() }}
            />
        );
    }

    renderMenu(menuItemsList: MenuItemType[], needCancelItem: boolean = true) {
        return (
            <React.Fragment>
                <FlatList
                    data={menuItemsList}
                    renderItem={({ item }) => this.renderMenuItem(item)}
                    showsVerticalScrollIndicator={false}
                />
                {this.renderCancelItem(needCancelItem)}
            </React.Fragment>
        );
    }

    render() {
        const menuComponent = this.renderMenu(this.menuItemsList, this.needCancelItem);
        return (
            <UICustomSheet
                ref={(component) => { this.customSheet = component; }}
                masterSheet={false}
                component={menuComponent}
                fullWidth
                onCancel={this.onCancel}
            />
        );
    }

    static defaultProps: Props;
}

UIActionSheet.defaultProps = {
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
    onCancel: () => {},
};

