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
        this.onCancelCallback = onCancelCallback;
        const component = this.renderMenu(menuItemsList, needCancelItem);
        UICustomSheet.show({
            component,
            fullWidth: true,
        });
    }

    static hide(callback: () => void) {
        UICustomSheet.hide(callback);
    }

    static onCancelCallback: () => void;

    // Setters

    // Getters

    // Actions

    // Render
    static renderCancelItem(needCancelItem: boolean = true) {
        if (!needCancelItem) {
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

    static renderMenu(menuItemsList: MenuItemType[], needCancelItem: boolean) {
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
}

