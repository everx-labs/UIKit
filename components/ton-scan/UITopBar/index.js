import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIDot from '../../design/UIDot';
import UIMenuView from '../../menus/UIMenuView';
import UIFontStyle from '../../../helpers/UIFontStyle';
import UISearchField from '../UISearchField';

import menuIcon from '../../../assets/ico-open-menu/open-menu.png';

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        marginTop: UIConstant.mediumContentOffset(),
        // left: 0,
        // right: 0,
        height: UIConstant.bigCellHeight(),
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'transparent',
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

    // Setters
    setSelectedIndex(selectedIndex) {
        this.state.selectedIndex = selectedIndex;
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
                <Text style={[UIFontStyle.primarySmallMedium, UIStyle.marginRightSmall]}>
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

    renderLeftPart() {
        const icon = <View style={styles.iconContainer} />;
        return (
            <View style={{ flexDirection: 'row' }}>
                {icon}
                {icon}
                {this.renderNetworkMenu()}
            </View>
        );
    }

    renderMenu() {
        if (this.props.menuExpanded) {
            return this.renderExpandedMenu();
        }
        return (
            <Image source={menuIcon} style={styles.marginDefault} />
        );
    }

    renderExpandedMenu() {
        const menu = this.props.menuItems.map(({ title, path }) => {
            return (
                <Text
                    style={[UIFontStyle.primarySmallMedium, styles.marginDefault]}
                    key={`top~bar~right~menu~item~${title}`}
                >
                    {title}
                </Text>
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
        return (
            <View style={styles.container}>
                {this.renderLeftPart()}
                {this.renderSearchField()}
                {this.renderMenu()}
            </View>
        );
    }
}

UITopBar.defaultProps = {
    menuExpanded: false,
    menuItems: [],
    searchExpression: '',
    onChangeSearchExpression: null,
};
