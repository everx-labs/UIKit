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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        margin: UIConstant.contentOffset(),
    },
    menuTrigger: {
        paddingHorizontal: UIConstant.contentOffset(),
        height: UIConstant.bigCellHeight(),
    },
});

export type NavigationMenuList = { title: string, screenName: string }[];

type NetworksList = MenuItemType[];

type Props = {
    navigation?: ReactNavigation,
    screenWidth: number,
    hidden: boolean,
    menuItemsInRow: boolean,
    menuItems: NavigationMenuList,
    searchExpression: string,
    onChangeSearchExpression: ((string) => void) | null,
    onPressShowMenu: () => void,
    onFocus: () => void,
    onBlur: () => void,
};

type State = {
    selectedIndex: number,
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
            leftPartRightEdge: 0,
            centerLeftEdge: 0,
        };
    }

    // Events
    onLeftMenuLayout(e: any) {
        const { width } = e.nativeEvent.layout;
        this.setLeftPartRightEdge(width);
    }

    onSearchFieldLayout(e: any) {
        const { x } = e.nativeEvent.layout;
        this.setCenterLeftEdge(x);
    }

    // Setters
    setSelectedIndex(selectedIndex: number) {
        this.setStateSafely({ selectedIndex });
    }

    setLeftPartRightEdge(leftPartRightEdge) {
        this.setStateSafely({ leftPartRightEdge });
    }

    setCenterLeftEdge(centerLeftEdge) {
        this.setStateSafely({ centerLeftEdge });
    }

    // Getters
    getSelectedIndex() {
        return this.state.selectedIndex;
    }

    getSelectedNetwork() {
        const index = this.getSelectedIndex();
        return this.networksList[index].title;
    }

    getLeftPartRightEdge() {
        return this.state.leftPartRightEdge;
    }

    getCenterLeftEdge() {
        return this.state.centerLeftEdge;
    }

    getLeftOverlap() {
        const leftPartRightEdge = this.getLeftPartRightEdge();
        const centerLeftEdge = this.getCenterLeftEdge();
        return this.props.onChangeSearchExpression
            && leftPartRightEdge > centerLeftEdge;
    }

    // Actions
    navigateTo(screenName: string) {
        const { navigation } = this.props;
        if (screenName && navigation) {
            navigation.navigate(screenName);
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
                onLayout={e => this.onLeftMenuLayout(e)}
                style={{ flexDirection: 'row' }}
            >
                {this.renderIcon()}
                {this.renderIcon()}
                {this.renderNetworkMenu()}
            </View>
        );
    }

    renderMenu() {
        if (this.props.menuItemsInRow) {
            return this.renderRowMenu();
        }
        if (!this.props.onPressShowMenu) {
            return null;
        }
        return (
            <UIImageButton
                image="menu"
                buttonStyle={styles.marginDefault}
                onPress={() => this.props.onPressShowMenu()}
            />
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
            <View style={UIStyle.centerLeftContainer}>
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
                    onLayout={e => this.onSearchFieldLayout(e)}
                />
            </View>
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }
        const leftOverlap = this.getLeftOverlap();
        const heightStyle = leftOverlap ? styles.doubleHeight : styles.singleHeight;
        return (
            <View style={[styles.container, heightStyle]}>
                {this.renderSearchField()}
                {this.renderLeftPart()}
                {this.renderMenu()}
            </View>
        );
    }

    static defaultProps: Props;
}

UITopBar.defaultProps = {
    hidden: false,
    screenWidth: 0,
    menuItemsInRow: false,
    menuItems: [],
    searchExpression: '',
    onChangeSearchExpression: null,
    onFocus: () => {},
    onBlur: () => {},
    onPressShowMenu: () => {},
};
