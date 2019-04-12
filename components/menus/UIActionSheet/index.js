// @flow
import React from 'react';

import { FlatList } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UICustomSheet from '../UICustomSheet';

import MenuItem from './MenuItem';
import type { CustomSheetProps, CustomSheetState } from '../UICustomSheet';
import type { MenuItemType } from '../UIMenuView';

let masterRef = null;

type Props = CustomSheetProps & {
    menuItemsList: MenuItemType[],
    needCancelItem: boolean,
    masterActionSheet: boolean,
};

class UIActionSheet extends UICustomSheet<Props, CustomSheetState> {
    static show(
        menuItemsList: MenuItemType[],
        needCancelItem?: boolean,
        onCancelCallback?: () => void,
    ) {
        if (masterRef) {
            masterRef.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    }

    menuItemsList: MenuItemType[];
    needCancelItem: boolean;

    // constructor
    constructor(props: Props) {
        super(props);
        this.menuItemsList = [];
        this.needCancelItem = true;
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

    // Actions
    show(
        menuItemsList: MenuItemType[] = [],
        needCancelItem: boolean = true,
        onCancelCallback: () => void = () => {},
    ) {
        if (this.props.masterActionSheet) {
            this.menuItemsList = menuItemsList;
            this.needCancelItem = needCancelItem;
            this.onCancelCallback = onCancelCallback;
        } else {
            this.menuItemsList = this.props.menuItemsList;
            this.needCancelItem = this.props.needCancelItem;
            this.onCancelCallback = this.props.onCancelCallback;
        }
        this.setModalVisible(true);
    }

    // Render
    renderCancelItem() {
        if (!this.needCancelItem) {
            return null;
        }
        return (
            <MenuItem
                title={UILocalized.Cancel}
                onPress={() => this.hide(() => this.onCancelCallback())}
            />
        );
    }

    renderMenuItem(item: MenuItemType) {
        return (
            <MenuItem
                {...item}
                onPress={() => this.hide(() => item.onPress())}
                textStyle={{ color: UIColor.primary() }}
            />
        );
    }

    renderContent() {
        const content = (
            <React.Fragment>
                <FlatList
                    data={this.menuItemsList}
                    renderItem={({ item }) => this.renderMenuItem(item)}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
                {this.renderCancelItem()}
            </React.Fragment>
        );
        return this.renderSheet(content);
    }

    static defaultProps: CustomSheetProps;
}

export default UIActionSheet;

UIActionSheet.defaultProps = {
    ...UICustomSheet.defaultProps,
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
};
