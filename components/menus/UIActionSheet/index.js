// @flow
import React from 'react';

import { FlatList } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UICustomSheet from '../UICustomSheet';

import MenuItem from './MenuItem';
import type { MenuItemType } from '../UIMenuView';

export default class UIActionSheet {
    static show(
        menuItemsList: MenuItemType[],
        needCancelItem?: boolean = true,
        onCancelCallback?: () => void = () => {},
    ) {
        this.menuItemsList = menuItemsList;
        this.needCancelItem = needCancelItem;
        this.onCancelCallback = onCancelCallback;
        const component = this.renderMenu();
        UICustomSheet.show({
            component,
            fullWidth: true,
        });
    }

    static hide(callback: () => void) {
        UICustomSheet.hide(callback);
    }

    static menuItemsList: MenuItemType[];
    static needCancelItem: boolean;
    static onCancelCallback: () => void;

    // Setters

    // Getters

    // Actions

    // Render
    static renderCancelItem() {
        if (!this.needCancelItem) {
            return null;
        }
        return (
            <MenuItem
                title={UILocalized.Cancel}
                onPress={() => UICustomSheet.hide(() => this.onCancelCallback())}
            />
        );
    }

    static renderMenuItem(item: MenuItemType) {
        return (
            <MenuItem
                {...item}
                onPress={() => UICustomSheet.hide(() => item.onPress())}
                textStyle={{ color: UIColor.primary() }}
            />
        );
    }

    static renderMenu() {
        return (
            <React.Fragment>
                <FlatList
                    data={this.menuItemsList}
                    renderItem={({ item }) => this.renderMenuItem(item)}
                    showsVerticalScrollIndicator={false}
                />
                {this.renderCancelItem()}
            </React.Fragment>
        );
    }
}

