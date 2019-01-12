import React, { Component } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Popover } from 'react-native-simple-popover';
import PropTypes from 'prop-types';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIMenuBackground from '../../../helpers/UIMenuBackground';
import UIDevice from '../../../helpers/UIDevice';
import UIActionSheet from '../../menus/UIActionSheet';

import MenuItem from './MenuItem';

let masterRef = null;
const MENU_TRIGGER = 'menu-trigger';

export default class UIMenuView extends Component {
    static hideMenu() {
        if (masterRef) {
            masterRef.hideMenu();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            triggerWidth: 0,
            menuMarginLeft: 0,
        };
    }

    // Events
    onTriggerLayout(e) {
        const { width: triggerWidth } = e.nativeEvent.layout;
        this.setTriggerWidth(triggerWidth);
    }

    onMenuLayout(e) {
        const { width: menuWidth } = e.nativeEvent.layout;
        const triggerWidth = this.getTriggerWidth();
        if (menuWidth > triggerWidth) {
            this.setMenuMarginLeft(menuWidth - triggerWidth);
        }
    }

    // Setters
    setIsVisible(isVisible = true) {
        this.setState({ isVisible });
    }

    setTriggerWidth(triggerWidth) {
        this.setState({ triggerWidth });
    }

    setMenuMarginLeft(menuMarginLeft) {
        this.setState({ menuMarginLeft });
    }

    // Getters
    getTriggerWidth() {
        return this.state.triggerWidth;
    }

    getMenuPaddingLeft() {
        return this.state.menuMarginLeft;
    }

    isVisible() {
        return this.state.isVisible;
    }

    // Actions
    openMenu() {
        if (Platform.OS === 'web' || UIDevice.isTablet()) {
            this.setIsVisible();
            this.initClickListenerForWeb();
            UIMenuBackground.initBackgroundForTablet();
            masterRef = this;
        } else {
            const { menuItemsList, needCancelItem, onCancelCallback } = this.props;
            UIActionSheet.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    }

    hideMenu() {
        if (Platform.OS === 'web' || UIDevice.isTablet()) {
            this.setIsVisible(false);
            this.deinitClickListenerForWeb();
            UIMenuBackground.hideBackgroundForTablet();
            masterRef = null;
        }
    }

    initClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        this.clickListener = (e) => {
            const triggers = Array.from(document.getElementsByClassName(MENU_TRIGGER));
            if (triggers && triggers.length) {
                const clickOnTrigger = triggers.reduce((contains, trigger) => {
                    if (!contains) {
                        return trigger.contains(e.target);
                    }
                    return contains;
                }, false);
                if (!clickOnTrigger) {
                    this.hideMenu();
                }
            }
        };
        window.addEventListener(listenerType, this.clickListener);
    }

    deinitClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    // Render
    renderMenu() {
        return (
            <View
                style={[
                    UIConstant.cardShadow(),
                    { marginLeft: this.getMenuPaddingLeft() },
                    { backgroundColor: UIColor.backgroundPrimary() },
                ]}
                onLayout={e => this.onMenuLayout(e)}
            >
                {this.props.menuItemsList.map(item => (
                    <MenuItem
                        key={`${Math.random()}~MenuItem~${item.title}`}
                        title={item.title}
                        disabled={item.disabled}
                        onSelect={() => {
                            item.onPress();
                            this.hideMenu();
                        }}
                    />
                ))}
            </View>
        );
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Popover
                    placement={this.props.placement}
                    arrowWidth={0}
                    arrowHeight={0}
                    isVisible={this.isVisible()}
                    // pointerEvents="auto" // doesn't works for some reason
                    component={() => this.renderMenu()}
                >
                    <TouchableOpacity
                        className={MENU_TRIGGER}
                        onPress={() => this.openMenu()}
                        onLayout={e => this.onTriggerLayout(e)}
                    >
                        <View pointerEvents="none">
                            {this.props.children}
                        </View>
                    </TouchableOpacity>
                </Popover>
            </View>
        );
    }
}

UIMenuView.defaultProps = {
    menuItemsList: [],
    placement: 'bottom',
    needCancelItem: true, // for iOS and Android only
    onCancelCallback: () => {}, // for iOS and Android only
};

UIMenuView.propTypes = {
    menuItemsList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    placement: PropTypes.string,
    needCancelItem: PropTypes.bool,
    onCancelCallback: PropTypes.func,
};
