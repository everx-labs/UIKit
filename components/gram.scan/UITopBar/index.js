// @flow
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { MenuItemType } from '../../menus/UIMenuView';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIDot from '../../design/UIDot';
import UIMenuView from '../../menus/UIMenuView';
import UITextStyle from '../../../helpers/UITextStyle';
import UISearchField from '../UISearchField';
import UIImageButton from '../../buttons/UIImageButton';
import UITextButton from '../../buttons/UITextButton';

import type { ReactNavigation } from '../../navigation/UINavigationBar';

const styles = StyleSheet.create({
    container: {
        marginTop: UIConstant.mediumContentOffset(),
        backgroundColor: 'transparent',
    },
    singleHeight: {
        height: UIConstant.bigCellHeight(),
    },
    doubleHeight: {
        height: UIConstant.bigCellHeight() * 2,
    },
    iconContainer: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
        margin: UIConstant.contentOffset(),
        backgroundColor: '#E7EBED',
    },
    marginDefault: {
        marginHorizontal: UIConstant.contentOffset(),
    },
    menuTrigger: {
        paddingHorizontal: UIConstant.contentOffset(),
        height: UIConstant.defaultCellHeight(),
    },
});

export type NavigationMenuList = { title: string, screenName: string }[];

type NetworksList = MenuItemType[];

type Props = {
    navigation?: ReactNavigation,
    screenWidth: number,
    hidden: boolean,
    menuItems: NavigationMenuList,
    searchExpression: string,
    onChangeSearchExpression: ((string) => void) | null,
    onPressShowMenu: () => void,
    onFocus: () => void,
    onBlur: () => void,
};

type State = {
    selectedIndex: number,
    leftWidth: number,
    rightWidth: number,
};

export default class UITopBar extends UIComponent<Props, State> {
    networksList: NetworksList;

    constructor(props: Props) {
        super(props);
        this.networksList = [
            {
                title: 'Mainnet',
                onPress: () => this.setSelectedIndex(0),
            },
            {
                title: 'Testnet',
                onPress: () => this.setSelectedIndex(1),
            },
        ];

        this.state = {
            selectedIndex: 0,
            leftWidth: 0,
            rightWidth: 0,
        };
    }

    // Events
    onLeftLayout(e: any) {
        const { width } = e.nativeEvent.layout;
        this.setLeftWidth(width);
    }

    onRightLayout(e: any) {
        const { width } = e.nativeEvent.layout;
        this.setRightWidth(width);
    }

    // Setters
    setSelectedIndex(selectedIndex: number) {
        this.setStateSafely({ selectedIndex });
    }

    setLeftWidth(leftWidth: number) {
        this.setStateSafely({ leftWidth });
    }

    setRightWidth(rightWidth: number) {
        this.setStateSafely({ rightWidth });
    }

    // Getters
    getSelectedIndex() {
        return this.state.selectedIndex;
    }

    getSelectedNetwork() {
        const index = this.getSelectedIndex();
        return this.networksList[index].title;
    }

    getLeftWidth() {
        return this.state.leftWidth;
    }

    getRightWidth() {
        return this.state.rightWidth;
    }

    isDoubleHeightNeeded() {
        const { screenWidth, onChangeSearchExpression } = this.props;
        const leftWidth = this.getLeftWidth();
        return onChangeSearchExpression && leftWidth > (screenWidth / 4);
    }

    // Actions
    navigateTo(screenName: string) {
        const { navigation } = this.props;
        if (screenName && navigation) {
            navigation.push(screenName);
        }
    }

    // Render
    renderNetworkMenu() {
        const menuTrigger = (
            <View style={[UIStyle.centerLeftContainer, styles.menuTrigger]}>
                <Text style={[UITextStyle.primarySmallMedium, UIStyle.marginRightSmall]}>
                    {this.getSelectedNetwork()}
                </Text>
                <UIDot />
            </View>
        );
        return (
            <UIMenuView
                menuItemsList={this.networksList}
            >
                {menuTrigger}
            </UIMenuView>
        );
    }

    renderIcon() {
        return (
            <TouchableOpacity
                onPress={() => this.navigateTo('MainScreen')}
            >
                <View style={styles.iconContainer} />
            </TouchableOpacity>
        );
    }

    renderLeftPart() {
        return (
            <View
                onLayout={e => this.onLeftLayout(e)}
                style={UIStyle.centerLeftContainer}
            >
                {this.renderIcon()}
                {this.renderIcon()}
                {this.renderNetworkMenu()}
            </View>
        );
    }

    renderMenu() {
        const { onPressShowMenu, onChangeSearchExpression, screenWidth } = this.props;
        const isDoubleHeightNeeded = this.isDoubleHeightNeeded();
        const rightWidth = this.getRightWidth();
        const shareOfWidth = !onChangeSearchExpression || isDoubleHeightNeeded ? 1 / 2 : 1 / 4;
        if (screenWidth * shareOfWidth >= rightWidth) {
            return this.renderRowMenu();
        }
        if (!onPressShowMenu) {
            return null;
        }
        return (
            <View style={UIStyle.justifyCenter}>
                <UIImageButton
                    image="menu"
                    buttonStyle={styles.marginDefault}
                    onPress={() => onPressShowMenu()}
                />
            </View>
        );
    }

    renderRowMenu() {
        if (!this.props.menuItems) {
            return null;
        }
        const menu = this.props.menuItems.map(({ title, screenName }) => {
            return (
                <UITextButton
                    key={`top~bar~right~menu~item~${title}`}
                    buttonStyle={styles.marginDefault}
                    textStyle={UITextStyle.primarySmallMedium}
                    title={title}
                    onPress={() => this.navigateTo(screenName)}
                />
            );
        });
        return (
            <View
                onLayout={e => this.onRightLayout(e)}
                style={UIStyle.centerLeftContainer}
            >
                {menu}
            </View>
        );
    }

    renderSearchField() {
        const {
            searchExpression, onChangeSearchExpression, onFocus, onBlur,
        } = this.props;
        if (!onChangeSearchExpression) {
            return null;
        }
        return (
            <View
                style={[UIStyle.absoluteFillObject, UIStyle.alignCenter, UIStyle.justifyEnd]}
            >
                <UISearchField
                    screenWidth={this.props.screenWidth}
                    searchExpression={searchExpression}
                    onChangeSearchExpression={onChangeSearchExpression}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </View>
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }
        const isDoubleNeeded = this.isDoubleHeightNeeded();
        const heightStyle = isDoubleNeeded ? styles.doubleHeight : styles.singleHeight;
        const topSearchField = isDoubleNeeded ? null : this.renderSearchField();
        const bottomSearchField = isDoubleNeeded ? this.renderSearchField() : null;
        return (
            <View style={[styles.container, heightStyle]}>
                {bottomSearchField}
                <View style={UIStyle.rowSpaceContainer}>
                    {topSearchField}
                    {this.renderLeftPart()}
                    {this.renderMenu()}
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UITopBar.defaultProps = {
    hidden: false,
    screenWidth: 0,
    menuItems: [],
    searchExpression: '',
    onChangeSearchExpression: null,
    onFocus: () => {},
    onBlur: () => {},
    onPressShowMenu: () => {},
};
