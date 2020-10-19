// @flow
import React from 'react';

import MenuItem from '../UIActionSheet/MenuItem';
import type { MenuItemType } from '../UIActionSheet/MenuItem';
import UIActionSheet from '../UIActionSheet';
import UIPopover from '../UIPopover';
import type { PopoverProps, PopoverState } from '../UIPopover';

type Props = PopoverProps & {
    menuItemsList: MenuItemType[],
    menuItems: MenuItemType[],
    reversedColors?: boolean,
    needCancelItem: boolean, // for iOS and Android only
    onCancelCallback: () => void, // for iOS and Android only
};

export default class UIPopoverMenu extends UIPopover<Props, PopoverState> {
    static defaultProps: Props = {
        ...UIPopover.defaultProps,
        menuItemsList: [], // deprecated,
        menuItems: [],
        reversedColors: false,
        needCancelItem: true, // for iOS and Android only
        onCancelCallback: () => {}, // for iOS and Android only
    };

    // deprecated, use hide(), inherited from UIPopover
    static hideMenu() {
        UIPopover.hide();
    }

    constructor(props: Props) {
        super(props);
        this.isMenu = true;
    }

    // Events

    // Setters

    // Getters
    getMenuItems() {
        return this.props.menuItems.length ? this.props.menuItems : this.props.menuItemsList;
    }

    // Actions
    showNarrowMenu(): void {
        const { needCancelItem, onCancelCallback } = this.props;
        UIActionSheet.show(this.getMenuItems(), needCancelItem, onCancelCallback);
    }

    // Render
    renderMenu(): ?React$Node[] {
        return this.getMenuItems().map<React$Node>(item => !!item && (
            <MenuItem
                {...item}
                key={`${Math.random()}~MenuItem~${item.title}`}
                reversedColors={this.props.reversedColors}
                onPress={() => {
                    if (item.onPress) item.onPress();
                    UIPopover.hide();
                }}
            />
        ));
    }
}
