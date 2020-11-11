// @flow
import React from 'react';
import { FlatList } from 'react-native';

import { UIComponent } from '@uikit/components';

import { uiLocalized } from '@tonlabs/uikit.localization';

import MenuItem from './MenuItem';
import type { MenuItemType } from './MenuItem';
import UICustomSheet from '../UICustomSheet';

type Props = {
    menuItemsList: MenuItemType[],
    needCancelItem: boolean,
    masterActionSheet: boolean,
    fullWidth: boolean,
    onCancel: () => void,
};
type State = {
    menuItemsList: MenuItemType[],
    needCancelItem: boolean,
};

let masterRef = null;

export default class UIActionSheet extends UIComponent<Props, State> {
    static defaultProps: Props = {
        masterActionSheet: true,
        menuItemsList: [],
        needCancelItem: true,
        fullWidth: true,
        onCancel: () => {},
    }

    static show(
        menuItemsList: MenuItemType[],
        needCancelItem?: boolean,
        onCancelCallback?: () => void,
        fullWidth: boolean = true,
    ) {
        if (masterRef) {
            masterRef.show(menuItemsList, needCancelItem, onCancelCallback, fullWidth);
        }
    }

    static hide(callback: () => void) {
        if (masterRef) {
            masterRef.hide(callback);
        }
    }

    fullWidth: boolean;
    onCancel: () => void;
    customSheet: ?UICustomSheet;
    menuItemsList: MenuItemType[];
    needCancelItem: boolean;

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            menuItemsList: [],
            needCancelItem: true,
        };
    }

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
    getMenuItemsList(): MenuItemType[] {
        return this.state.menuItemsList;
    }

    getNeedCancelItem(): boolean {
        return this.state.needCancelItem;
    }

    // Actions
    show(
        menuItemsList?: MenuItemType[],
        needCancelItem?: boolean,
        onCancel?: () => void,
        fullWidth: boolean = true,
    ) {
        this.onCancel = onCancel || this.props.onCancel;
        this.fullWidth = fullWidth != null ? fullWidth : this.props.fullWidth;
        this.setStateSafely({
            menuItemsList: menuItemsList || this.props.menuItemsList,
            needCancelItem: needCancelItem !== undefined
                ? needCancelItem
                : this.props.needCancelItem,
        }, () => {
            if (this.customSheet) {
                this.customSheet.show();
            }
        });
    }

    hide(callback: () => void) {
        if (this.customSheet) {
            this.customSheet.hide(callback);
        }
    }

    // Render
    renderCancelItem() {
        if (!this.getNeedCancelItem()) {
            return null;
        }
        return (
            <MenuItem
                title={uiLocalized.Cancel}
                onPress={() => {
                    if (this.customSheet) {
                        this.customSheet.hide(this.onCancel);
                    }
                }}
            />
        );
    }

    renderMenuItem = ({ item }: { item: MenuItemType }) => {
        if (!item) return null;

        return (
            <MenuItem
                {...item}
                onPress={() => {
                    if (this.customSheet) {
                        this.customSheet.hide(item.onPress);
                    }
                }}
            />
        );
    };

    renderMenu() {
        return (
            <React.Fragment>
                <FlatList
                    data={this.getMenuItemsList()}
                    keyExtractor={item => `MenuItem~${item?.title}`}
                    renderItem={this.renderMenuItem}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
                {this.renderCancelItem()}
            </React.Fragment>
        );
    }

    render() {
        return (
            <UICustomSheet
                ref={(component) => { this.customSheet = component; }}
                masterSheet={false}
                showHeader={false}
                component={this.renderMenu()}
                fullWidth={this.fullWidth}
                onCancel={this.onCancel}
            />
        );
    }
}
