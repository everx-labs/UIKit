import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIDot from '../../design/UIDot';
import UIMenuView from '../../menus/UIMenuView';
import UITextStyle from '../../../helpers/UITextStyle';
import UISearchField from '../UISearchField';
import UIImageButton from '../../buttons/UIImageButton';
import UITextButton from '../../buttons/UITextButton';

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

export default class UITopBar extends UIComponent {
    constructor(props) {
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
    onNavigationMenuItemPress(screenName) {
        if (screenName) {
            this.props.navigation.navigate(screenName);
        }
    }

    // Setters
    setSelectedIndex(selectedIndex) {
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
                onPress={() => this.props.navigation.navigate('MainScreen')}
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
        return (
            <UIImageButton
                image="menu"
                buttonStyle={styles.marginDefault}
                onPress={() => this.props.onPressShowMenu()}
            />
        );
    }

    renderRowMenu() {
        const menu = this.props.menuItems.map(({ title, screenName }) => {
            return (
                <UITextButton
                    key={`top~bar~right~menu~item~${title}`}
                    buttonStyle={styles.marginDefault}
                    textStyle={UITextStyle.primarySmallMedium}
                    title={title}
                    onPress={() => this.onNavigationMenuItemPress(screenName)}
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
}

UITopBar.defaultProps = {
    navigation: null,
    hidden: false,
    menuItemsInRow: false,
    menuItems: [],
    searchExpression: '',
    onChangeSearchExpression: null,
    onPressShowMenu: () => {},
};
