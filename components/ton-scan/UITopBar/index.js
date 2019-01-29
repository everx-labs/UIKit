import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Link } from 'react-router-dom';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIDot from '../../design/UIDot';
import UIMenuView from '../../menus/UIMenuView';

import menuIcon from '../../../assets/ico-open-menu/open-menu.png';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: UIConstant.mediumContentOffset(),
        left: 0,
        right: 0,
        height: UIConstant.bigCellHeight(),
        flexDirection: 'row',
        justifyContent: 'space-between',
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
                <Text style={[UIStyle.textPrimarySmallMedium, UIStyle.marginRightSmall]}>
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
                <Link to={path} key={`top~bar~right~menu~item~${title}`}>
                    <Text style={[UIStyle.textPrimarySmallMedium, styles.marginDefault]}>
                        {title}
                    </Text>
                </Link>
            );
        });
        return (
            <View style={UIStyle.centerLeftContainer}>
                {menu}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderLeftPart()}
                {this.renderMenu()}
            </View>
        );
    }
}

UITopBar.defaultProps = {
    menuExpanded: false,
    menuItems: [],
};
