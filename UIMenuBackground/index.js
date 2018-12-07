import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { PopoverContainer } from 'react-native-simple-popover';

import UIMenuView from '../UIMenuView';
import UIStyle from '../UIStyle';
import UIDevice from '../UIDevice';

let masterRef = null;

export default class UIMenuBackground extends Component {
    static initBackgroundForTablet() {
        if (masterRef) {
            masterRef.initBackgroundForTablet();
        }
    }

    static hideBackgroundForTablet() {
        if (masterRef) {
            masterRef.hideBackgroundForTablet();
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            isBackgroundActive: false,
        };
    }

    componentDidMount() {
        masterRef = this;
    }

    componentWillUnmount() {
        masterRef = null;
    }

    // Setters
    setIsBackgroundActive(isBackgroundActive = true) {
        this.setState({ isBackgroundActive });
    }

    // Getters
    isBackgroundActive() {
        return this.state.isBackgroundActive;
    }

    // Actions
    initBackgroundForTablet() {
        this.setIsBackgroundActive();
    }

    hideBackgroundForTablet() {
        this.setIsBackgroundActive(false);
    }

    // Render
    renderContent() {
        const pointerEvents = this.isBackgroundActive() ? 'box-only' : 'auto';
        const onPress = this.isBackgroundActive() ? { onPress: () => UIMenuView.hideMenu() } : null;
        // We use UIMenuView only for Tablet and Web now, for web we use window.addEventListener
        if (UIDevice.isTablet()) {
            return (
                <TouchableWithoutFeedback {...onPress}>
                    <View
                        style={UIStyle.screenContainer}
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

UIMenuBackground.defaultProps = {
    onClose: () => {},
};

UIMenuBackground.propTypes = {
    onClose: PropTypes.func,
};
