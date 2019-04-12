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
    needCancelItem?: boolean,
    masterActionSheet?: boolean,
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
        this.onCancel = onCancel;
        const component = this.renderMenu(menuItemsList, needCancelItem);
        UICustomSheet.show({
            component,
            fullWidth: true,
        });
    }

    // Render
    renderCancelItem(needCancelItem: boolean = true) {
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

    renderMenu(menuItemsList: MenuItemType[], needCancelItem: boolean) {
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

    static defaultProps: Props;
}

UIActionSheet.defaultProps = {
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
};

