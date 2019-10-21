// @flow
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { PopoverContainer } from 'react-native-simple-popover';

import UIStyle from '../../../helpers/UIStyle';
import UIDevice from '../../../helpers/UIDevice';
import UIComponent from '../../UIComponent';

let masterRef = null;

type Props = {
    children: React$Node,
};

type State = {
    isBackgroundActive: boolean,
};

export default class UIMenuBackground extends UIComponent<Props, State> {
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
        this.callback = () => {};

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
        const onPress = this.isBackgroundActive() ? { onPress: this.callback } : null;
        // We use UIMenuView only for Tablet and Web now, for web we use window.addEventListener
        if (UIDevice.isTablet()) {
            return (
                <TouchableWithoutFeedback {...onPress}>
                    <View
                        style={UIStyle.container.screen()}
                        pointerEvents={pointerEvents}
                    >
                        {this.props.children}
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return this.props.children;
    }

    render() {
        return (
            <PopoverContainer>
                {this.renderContent()}
            </PopoverContainer>
        );
    }
}
