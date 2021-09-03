// @flow
import React from 'react';

import { UIPopup } from '@tonlabs/uikit.popups';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UILabelColors, TypographyVariants } from '@tonlabs/uikit.hydrogen';
import MenuItem from '../UIActionSheet/MenuItem';
import type { MenuItemType } from '../UIActionSheet/MenuItem';
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
        actionSheetIsVisible: false,
        title: '',
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
    hideNarrowMenu(): void {
        this.setStateSafely({
            actionSheetIsVisible: false,
        });
    }

    showNarrowMenu(): void {
        const { needCancelItem, onCancelCallback } = this.props;
        this.setStateSafely({
            actionSheetIsVisible: true,
            needCancelItem: needCancelItem,
            onCancelCallback: onCancelCallback,
        });
    }

    // Render
    renderMenu(): ?(React$Node[]) {
        return (
            <>
                {!!this.props.title && (
                    <MenuItem
                        title={this.props.title}
                        key={`${Math.random()}~MenuItem~title`}
                        reversedColors={this.props.reversedColors}
                        titleStyle={UILabelColors.TextSecondary}
                        titleRole={TypographyVariants.ParagraphFootnote}
                    />
                )}
                {this.getMenuItems().map<React$Node>(
                    item =>
                        !!item && (
                            <MenuItem
                                {...item}
                                key={`${Math.random()}~MenuItem~${item.title}`}
                                reversedColors={this.props.reversedColors}
                                onPress={() => {
                                    if (item.onPress) item.onPress();
                                    UIPopover.hide();
                                }}
                            />
                        ),
                )}
            </>
        );
    }

    renderActionSheet(): ?(React$Node[]) {
        return (
            <UIPopup.ActionSheet note={this.props.title} visible={this.state.actionSheetIsVisible}>
                {this.getMenuItems().map<React$Node>(
                    item =>
                        !!item && (
                            <UIPopup.ActionSheet.Action
                                title={item.title}
                                key={`${Math.random()}~SheetMenuItem~${item.title}`}
                                onPress={() => {
                                    this.hideNarrowMenu();
                                    if (item.onPress) item.onPress();
                                }}
                                type={
                                    item.disabled
                                        ? UIPopup.ActionSheet.Action.Type.Disabled
                                        : UIPopup.ActionSheet.Action.Type.Neutral
                                }
                            />
                        ),
                )}
                {this.state.needCancelItem && (
                    <UIPopup.ActionSheet.Action
                        title={uiLocalized.Cancel}
                        key={`${Math.random()}~SheetMenuItem~Cancel`}
                        onPress={() => {
                            this.hideNarrowMenu();
                            if (this.state.onCancelCallback) this.state.onCancelCallback();
                        }}
                        type={UIPopup.ActionSheet.Action.Type.Cancel}
                    />
                )}
            </UIPopup.ActionSheet>
        );
    }
}
