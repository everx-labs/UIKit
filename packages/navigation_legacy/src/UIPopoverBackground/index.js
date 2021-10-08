// @flow
import React from 'react';
import { View } from 'react-native';
import { PopoverContainer } from 'react-native-simple-popover';
import { TapGestureHandler, State as RNGHState } from 'react-native-gesture-handler';

import { UIStyle, UIDevice } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';

let masterRef = null;

type Props = {
    children: React$Node,
};

type State = {
    isBackgroundActive: boolean,
};

export default class UIPopoverBackground extends UIComponent<Props, State> {
    static initBackgroundForTablet(callback: () => void) {
        if (masterRef) {
            masterRef.initBackgroundForTablet(callback);
        }
    }

    static hideBackgroundForTablet() {
        if (masterRef) {
            masterRef.hideBackgroundForTablet();
        }
    }

    callback: () => void;

    constructor(props: Props) {
        super(props);
        this.callback = () => {
            /** */
        };

        this.state = {
            isBackgroundActive: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        masterRef = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        masterRef = null;
    }

    // Setters
    setIsBackgroundActive(isBackgroundActive: boolean = true) {
        this.setStateSafely({ isBackgroundActive });
    }

    // Getters
    isBackgroundActive() {
        return this.state.isBackgroundActive;
    }

    // Actions
    initBackgroundForTablet(callback: () => void) {
        this.callback = callback;
        this.setIsBackgroundActive();
    }

    hideBackgroundForTablet() {
        this.setIsBackgroundActive(false);
    }

    // Render
    renderContent() {
        const pointerEvents = this.isBackgroundActive() ? 'box-only' : 'auto';
        // We use UIMenuView only for Tablet and Web now, for web we use window.addEventListener
        if (UIDevice.isTablet()) {
            return (
                <TapGestureHandler
                    enabled={this.isBackgroundActive()}
                    onHandlerStateChange={({ nativeEvent: { state } }) => {
                        if (state === RNGHState.ACTIVE && this.callback != null) {
                            this.callback();
                        }
                    }}
                >
                    <View style={UIStyle.container.screen()} pointerEvents={pointerEvents}>
                        {this.props.children}
                    </View>
                </TapGestureHandler>
            );
        }
        return this.props.children;
    }

    render() {
        return <PopoverContainer>{this.renderContent()}</PopoverContainer>;
    }
}
