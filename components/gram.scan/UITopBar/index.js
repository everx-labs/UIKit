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
        height: UIConstant.bigCellHeight(),
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
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
    hidden: boolean,
    menuItemsInRow: boolean,
    menuItems: NavigationMenuList,
    searchExpression: string,
    onChangeSearchExpression: ((string) => void) | null,
    onPressShowMenu: () => void,
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
        };
    }

    // Events

    // Setters
    setSelectedIndex(selectedIndex: number) {
        this.setStateSafely({ selectedIndex });
    }

    // Getters
    getSelectedIndex() {
        return this.state.selectedIndex;
    }

    getSelectedNetwork() {
        const index = this.getSelectedIndex();
        return this.networksList[index].title;
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
            <View style={{ flexDirection: 'row' }}>
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
        const { searchExpression, onChangeSearchExpression } = this.props;
        if (!onChangeSearchExpression) {
            return null;
        }
        return (
            <View style={[UIStyle.absoluteFillObject, { alignItems: 'center' }]}>
                <UISearchField
                    searchExpression={searchExpression}
                    onChangeSearchExpression={onChangeSearchExpression}
                />
            </View>
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }
        return (
            <View style={styles.container}>
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
    menuItemsInRow: false,
    menuItems: [],
    searchExpression: '',
    onChangeSearchExpression: null,
    onPressShowMenu: () => {},
};
