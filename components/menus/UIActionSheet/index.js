// @flow
import React from 'react';

import { View, StyleSheet, TouchableWithoutFeedback, FlatList, Animated } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UICustomSheet from '../UICustomSheet';

import MenuItem from './MenuItem';
import type { CustomSheetProps, CustomSheetState } from '../UICustomSheet';
import type { MenuItemType } from '../UIMenuView';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
        justifyContent: 'flex-end',
    },
});

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
        this.marginBottom = new Animated.Value(-this.calculateHeight());
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
        this.setModalVisible(true, () => {
            Animated.spring(this.marginBottom, {
                toValue: UIConstant.contentOffset(),
            }).start();
        });
    }

    hide(callback: () => void) {
        Animated.timing(this.marginBottom, {
            toValue: -this.calculateHeight(),
            duration: UIConstant.animationDuration(),
        }).start(() => {
            this.setModalVisible(false, () => {
                setTimeout(() => {
                    if (callback) {
                        callback();
                    }
                }, 100); // Timeout is required!
            });
        });
    }

    calculateHeight() {
        const height = UIConstant.actionSheetItemHeight();
        const numberItems = (this.menuItemsList && this.menuItemsList.length) || 0;
        const actionSheetHeight = height * (numberItems + (this.needCancelItem ? 1 : 0));
        return actionSheetHeight + UIConstant.contentOffset();
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
        console.log(111);
        const content = (
            <React.Fragment>
                <FlatList
                    data={this.menuItemsList}
                    renderItem={({ item }) => this.renderMenuItem(item)}
                    scrollEnabled={false}
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
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
    ...UICustomSheet.defaultProps,
};
