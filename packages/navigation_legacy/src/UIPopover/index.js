// @flow
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';
import { Popover } from 'react-native-simple-popover';

import { UIDevice, UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UIBackgroundView, TouchableOpacity } from '@tonlabs/uikit.themes';
import { UICardSheet } from '@tonlabs/uikit.navigation';

import UIPopoverBackground from '../UIPopoverBackground';

let masterRef = null;

const POPOVER_MENU = 'popover-menu';
const POPOVER_TRIGGER = 'popover-button';

type Placement = 'top' | 'bottom' | 'left' | 'right';

export type PopoverProps = {
    placement?: Placement,
    children?: React$Node,
    testID?: string,
    style?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    componentStyle?: ViewStyleProp,
    narrow?: boolean,
    component?: React$Node,
    needCloseOnClick?: boolean,
    narrowContainerStyle?: ViewStyleProp,
    onShow: () => void,
    onHide?: () => void,
};

export type PopoverState = {
    isVisible: boolean,
    triggerWidth: number,
    marginLeft: number,
    cardVisible: boolean,
};

const styles = StyleSheet.create({
    slimContainer: {
        width: UIConstant.elasticWidthHalfNormal(),
    },
});

export default class UIPopover<Props, State> extends UIComponent<
    any & PopoverProps,
    any & PopoverState,
> {
    static defaultProps: any & PopoverProps = {
        placement: 'bottom',
        narrow: false,
        needCloseOnClick: true,
        onShow: () => {},
    };

    static hide() {
        if (masterRef) {
            masterRef.hide();
        }
    }

    firstClickIgnored: boolean;
    countdown: ?TimeoutID;
    isMenu: boolean;
    constructor(props: Props & PopoverProps) {
        super(props);
        this.firstClickIgnored = false;
        this.isMenu = false;
        this.state = {
            isVisible: false,
            triggerWidth: 0,
            marginLeft: 0,
            cardVisible: false,
        };
        this.countdown = null;
    }

    // Events
    onTriggerLayout = (e: ViewLayoutEvent) => {
        const { width: triggerWidth } = e.nativeEvent.layout;
        this.setTriggerWidth(triggerWidth);
    };

    onLayout = (e: ViewLayoutEvent) => {
        const { width: menuWidth } = e.nativeEvent.layout;
        const triggerWidth = this.getTriggerWidth();
        if (menuWidth > triggerWidth) {
            this.setMarginLeft((triggerWidth - menuWidth) / 2);
        }
    };

    onShow = () => this.showMenu();

    // Setters
    setIsVisible(isVisible: boolean = true) {
        return new Promise<void>(resolve => {
            this.setStateSafely({ isVisible }, resolve);
        });
    }

    setCardVisible = (visible: boolean) => {
        this.setStateSafely({ cardVisible: visible });
    };

    setTriggerWidth(triggerWidth: number) {
        this.setStateSafely({ triggerWidth });
    }

    setMarginLeft(marginLeft: number) {
        this.setStateSafely({ marginLeft });
    }

    // Getters
    getTriggerWidth(): number {
        return this.state.triggerWidth;
    }

    getMarginLeft(): number {
        return this.state.marginLeft;
    }

    isVisible(): boolean {
        return this.state.isVisible;
    }

    needPopover() {
        return (Platform.OS === 'web' && !this.props.narrow) || UIDevice.isTablet();
    }

    // Actions
    // When using `LongPress` to display the menu, it is necessary to ignore
    // the first click event that occurs once releasing the click/touch on web
    // otherwise, the menu will hide automatically once releasing the touch/click
    // preventing to be able to select any option from the menu.
    show() {
        this.showMenu();
        this.clearHideTimeout();
        this.countdown = setTimeout(() => this.hide(), 60000); // 1 min
    }

    async showMenu() {
        if (this.needPopover()) {
            if (!this.isVisible()) {
                UIPopover.hide(); // hide previously opened masterRef if any

                this.initClickListenerForWeb();
                UIPopoverBackground.initBackgroundForTablet(() => UIPopover.hide());
                await this.setIsVisible();
                masterRef = this;

                setTimeout(() => {
                    this.props.onShow();
                }, UIConstant.animationSmallDuration());
            } else {
                this.hide();
            }
        } else if (this.isMenu) {
            this.showNarrowMenu();
        } else {
            this.setCardVisible(true);
        }
    }

    showNarrowMenu(): void {
        // Virtual
    }

    clearHideTimeout() {
        if (this.countdown) {
            clearTimeout(this.countdown);
        }
    }

    hide() {
        if (this.needPopover()) {
            if (this.props.onHide) {
                this.props.onHide();
            }

            this.firstClickIgnored = false;
            this.setIsVisible(false);

            this.deinitClickListenerForWeb();
            UIPopoverBackground.hideBackgroundForTablet();
            masterRef = null;
        }

        this.clearHideTimeout();
    }

    clickListener: (e: any) => void;
    initClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }

        const listenerType = UIDevice.isDesktopWeb() || UIDevice.isWebkit() ? 'click' : 'touchend';

        this.clickListener = (e: any) => {
            if (!this.props.needCloseOnClick) {
                return;
            }

            if (!this.firstClickIgnored) {
                this.firstClickIgnored = true;
                return;
            }

            // Check the click on the popover menu
            const popover = document.getElementById(POPOVER_MENU);
            if (popover && popover.contains(e.target)) {
                return;
            }

            // Check the click on the button which calls the popover
            const trigger = document.getElementById(POPOVER_TRIGGER);
            if (trigger && trigger.contains(e.target)) {
                return;
            }

            // Hide in rest cases
            this.hide();
        };

        // Hide the popover if the click happens outside of the predefined components
        window.addEventListener(listenerType, this.clickListener);
    }

    deinitClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType = UIDevice.isDesktopWeb() || UIDevice.isWebkit() ? 'click' : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    // Render
    renderMenu(): ?(React$Node[]) {
        return null;
    }
    // Render
    renderActionSheet(): ?(React$Node[]) {
        return null;
    }

    renderPopover = () => {
        const menuStyle = this.isMenu
            ? [UIStyle.padding.horizontal()]
            : [styles.slimContainer, UIStyle.padding.default()];
        return (
            <UIBackgroundView
                nativeID={POPOVER_MENU}
                onLayout={this.onLayout}
                style={[
                    UIStyle.border.radiusDefault(),
                    UIStyle.common.cardShadow(),
                    ...menuStyle,
                    this.props.componentStyle,
                    { marginLeft: this.getMarginLeft() },
                ]}
            >
                {this.props.component || this.renderMenu()}
            </UIBackgroundView>
        );
    };

    render() {
        const { placement, testID, children, containerStyle, style } = this.props;
        const testIDProp = testID ? { testID } : null;

        return (
            <>
                <Popover
                    placement={placement}
                    arrowWidth={0}
                    arrowHeight={0}
                    isVisible={this.isVisible()}
                    component={this.renderPopover}
                >
                    <TouchableOpacity
                        nativeID={POPOVER_TRIGGER}
                        {...testIDProp}
                        onPress={this.onShow}
                        onLayout={this.onTriggerLayout}
                        style={containerStyle}
                    >
                        <View pointerEvents="none" style={style}>
                            {children}
                        </View>
                    </TouchableOpacity>
                </Popover>
                <UICardSheet
                    visible={this.state.cardVisible}
                    onClose={() => this.setCardVisible(false)}
                >
                    <UIBackgroundView style={this.props.narrowContainerStyle}>
                        {this.props.component}
                    </UIBackgroundView>
                </UICardSheet>
                {this.renderActionSheet()}
            </>
        );
    }
}
