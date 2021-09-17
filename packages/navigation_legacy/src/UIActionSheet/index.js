// @flow
// @deprecated
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { UICardSheet } from '@tonlabs/uikit.navigation';
import { uiLocalized } from '@tonlabs/uikit.localization';

import MenuItem from './MenuItem';
import type { MenuItemType } from './MenuItem';

const styles = StyleSheet.create({
    container: {
        borderRadius: UIConstant.mediumBorderRadius(),
    },
});

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
    cardVisible: boolean,
};

let masterRef = null;

export default class UIActionSheet extends UIComponent<Props, State> {
    static defaultProps: Props = {
        masterActionSheet: true,
        menuItemsList: [],
        needCancelItem: true,
        fullWidth: true,
        onCancel: () => {},
    };

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
    menuItemsList: MenuItemType[];
    needCancelItem: boolean;

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            menuItemsList: [],
            needCancelItem: true,
            cardVisible: false,
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
    setCardVisible = (visible: boolean) => {
        this.setStateSafely({ cardVisible: visible });
    };

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
        this.setStateSafely(
            {
                menuItemsList: menuItemsList || this.props.menuItemsList,
                needCancelItem:
                    needCancelItem !== undefined ? needCancelItem : this.props.needCancelItem,
            },
            () => {
                this.setCardVisible(true);
            },
        );
    }

    hide(callback?: () => void) {
        this.setCardVisible(false);
        if (callback) {
            callback();
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
                    this.hide(this.onCancel);
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
                    // $FlowFixMe
                    this.hide(item.onPress);
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
            <UICardSheet
                visible={this.state.cardVisible}
                onClose={() => this.setCardVisible(false)}
            >
                <UIBackgroundView style={styles.container}>{this.renderMenu()}</UIBackgroundView>
            </UICardSheet>
        );
    }
}
