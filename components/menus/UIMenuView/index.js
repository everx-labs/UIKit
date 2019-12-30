// @flow
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Popover } from 'react-native-simple-popover';

import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';

import UIColor from '../../../helpers/UIColor';
import UIMenuBackground from '../UIMenuBackground';
import UIDevice from '../../../helpers/UIDevice';
import UIEventHelper from '../../../helpers/UIEventHelper';
import UIActionSheet from '../../menus/UIActionSheet';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

import MenuItem from '../UIActionSheet/MenuItem';
import type { MenuItemType } from '../UIActionSheet/MenuItem';
import type { ClassNameProp } from '../../../types';

let masterRef = null;
const MENU_TRIGGER = 'menu-trigger';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type Props = {
    menuItemsList: MenuItemType[],
    placement?: Placement,
    needCancelItem?: boolean,
    children?: React$Node,
    onCancelCallback?: () => void,
    testID?: string,
    style?: any,
    containerStyle?: any,
};

type State = {
    isVisible: boolean,
    triggerWidth: number,
    menuMarginLeft: number,
};

export default class UIMenuView extends UIComponent<Props, State> {
    static defaultProps: Props = {
        menuItemsList: [],
        placement: 'bottom',
        needCancelItem: true, // for iOS and Android only
        onCancelCallback: () => {}, // for iOS and Android only
    };

    static hideMenu() {
        if (masterRef) {
            masterRef.hideMenu();
        }
    }

    firstClickIgnored: boolean;
    countdown: ?TimeoutID;
    constructor(props: Props) {
        super(props);
        this.firstClickIgnored = false;
        this.state = {
            isVisible: false,
            triggerWidth: 0,
            menuMarginLeft: 0,
        };
        this.countdown = null;
    }

    // Events
    onTriggerLayout = (e: ViewLayoutEvent) => {
        const { width: triggerWidth } = e.nativeEvent.layout;
        this.setTriggerWidth(triggerWidth);
    };

    onMenuLayout = (e: ViewLayoutEvent) => {
        const { width: menuWidth } = e.nativeEvent.layout;
        const triggerWidth = this.getTriggerWidth();
        if (menuWidth > triggerWidth) {
            this.setMenuMarginLeft(menuWidth - triggerWidth);
        }
    };

    onOpenMenu = (ignoreFirstClick: boolean = false) => {
        if (Platform.OS === 'web' || UIDevice.isTablet()) {
            this.setIsVisible();
            this.initClickListenerForWeb(ignoreFirstClick);
            UIMenuBackground.initBackgroundForTablet(() => UIMenuView.hideMenu());
            masterRef = this;
        } else {
            const { menuItemsList, needCancelItem, onCancelCallback } = this.props;
            UIActionSheet.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    };

    // When using `LongPress` to display the menu, it is necessary to ignore
    // the first click event that occurs once releasing the click/touch on web
    // otherwise, the menu will hide automatically once releasing the touch/click
    // preventing to be able to select any option from the menu.
    openMenu() {
        this.onOpenMenu(true);

        this.clearHideTimeout();

        this.countdown = setTimeout(() => this.hideMenu(), 60000); // 1 min
    }

    clearHideTimeout() {
        if (this.countdown) {
            clearTimeout(this.countdown);
        }
    }

    // Setters
    setIsVisible(isVisible: boolean = true) {
        this.setStateSafely({ isVisible });
    }

    setTriggerWidth(triggerWidth: number) {
        this.setStateSafely({ triggerWidth });
    }

    setMenuMarginLeft(menuMarginLeft: number) {
        this.setStateSafely({ menuMarginLeft });
    }

    // Getters
    getTriggerWidth(): number {
        return this.state.triggerWidth;
    }

    getMenuPaddingLeft(): number {
        return this.state.menuMarginLeft;
    }

    isVisible(): boolean {
        return this.state.isVisible;
    }

    // Actions
    hideMenu() {
        if (Platform.OS === 'web' || UIDevice.isTablet()) {
            this.firstClickIgnored = false;
            this.setIsVisible(false);
            this.deinitClickListenerForWeb();
            UIMenuBackground.hideBackgroundForTablet();
            masterRef = null;
        }

        this.clearHideTimeout();
    }

    clickListener: (e: any) => void;
    initClickListenerForWeb(ignoreFirstClick: boolean = false) {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() ? 'click' : 'touchend';
        this.clickListener = (e: any) => {
            if (ignoreFirstClick && !this.firstClickIgnored) {
                this.firstClickIgnored = true;
                return;
            }
            const eventResult = UIEventHelper.checkEventTarget(e, MENU_TRIGGER);
            if (!eventResult) {
                this.hideMenu();
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
    renderMenu = () => {
        const backgroundStyle = UIColor.getBackgroundColorStyle(UIColor.backgroundPrimary());
        return (
            <View
                style={[
                    UIStyle.border.radiusDefault(),
                    UIStyle.common.cardShadow(),
                    UIStyle.padding.horizontal(),
                    backgroundStyle,
                    { marginLeft: this.getMenuPaddingLeft() },
                ]}
                onLayout={this.onMenuLayout}
            >
                {this.props.menuItemsList.map(item => (
                    <MenuItem
                        {...item}
                        key={`${Math.random()}~MenuItem~${item.title}`}
                        onPress={() => {
                            if (item.onPress) item.onPress();
                            this.hideMenu();
                        }}
                    />
                ))}
            </View>
        );
    };

    render() {
        // This trick with class name required to suppress flow warning
        // on undeclared className prop.
        const setClassNameTrick: ClassNameProp = {
            className: MENU_TRIGGER,
        };
        const {
            placement,
            testID,
            children,
            containerStyle,
            style,
        } = this.props;
        const testIDProp = testID ? { testID } : null;

        return (
            <View style={[UIStyle.common.flex(), UIStyle.common.flexRow()]}>
                <Popover
                    placement={placement}
                    arrowWidth={0}
                    arrowHeight={0}
                    isVisible={this.isVisible()}
                    component={this.renderMenu}
                >
                    <TouchableOpacity
                        {...setClassNameTrick}
                        {...testIDProp}
                        onPress={this.onOpenMenu}
                        onLayout={this.onTriggerLayout}
                        style={containerStyle}
                    >
                        <View
                            pointerEvents="none"
                            style={style}
                        >
                            {children}
                        </View>
                    </TouchableOpacity>
                </Popover>
            </View>
        );
    }
}
