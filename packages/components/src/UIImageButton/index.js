/* eslint-disable global-require */
// @flow

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@uikit/core';

import UIComponent from '../UIComponent';

type ButtonImage = 'back' | 'close-primary' | 'close-secondary'
                    | 'close-dark-theme-secondary'
                    | 'close-light' | 'custom' | 'menu'
                    | 'menu-contained';

const assets = {
    back: () => require('@uikit/assets/ico-arrow-left/ico-arrow-left.png'),
    'close-primary': () => require('@uikit/assets/ico-close/close-blue.png'),
    'close-secondary': () => require('@uikit/assets/ico-close/close-grey.png'),
    'close-dark-theme-secondary': () => require('@uikit/assets/ico-close/close-dark-theme-secondary.png'),
    'close-light': () => require('@uikit/assets/ico-close/close-light.png'),
    'close-black': () => require('@uikit/assets/ico-close/close-black.png'),
    menu: () => require('@uikit/assets/ico-open-menu/open-menu.png'),
    'menu-contained': () => require('@uikit/assets/ico-menu-contained/menu.png'),
    custom: () => null,
};

type Props = {
    image: ButtonImage,
    customImage: ?ImageSource,
    onPress: () => void,
    buttonStyle?: ViewStyleProp,
};

type State = {};

export default class UIImageButton extends UIComponent<Props, State> {
    // Deprecated
    static Images = {
        back: 'back',
        closePrimary: 'close-primary',
        closeSecondary: 'close-secondary',
        closeDarkThemeSecondary: 'close-dark-theme-secondary',
        closeLight: 'close-light',
        menu: 'menu',
        menuContained: 'menu-contained',
        custom: 'custom',
    };

    static images = this.Images;

    static defaultProps: Props = {
        image: this.images.custom,
        customImage: null,
        buttonStyle: null,
        onPress: () => {},
    };

    // Getters
    getButtonStyle() {
        return this.props.buttonStyle;
    }

    getImage(): ?ImageSource {
        const { image, customImage } = this.props;
        if (image === UIImageButton.Images.custom) {
            return customImage;
        }
        // eslint-disable-next-line import/no-dynamic-require,global-require
        return assets[image]();
    }

    // React.Component
    render() {
        return (
            <TouchableOpacity
                style={[UIStyle.navigatorButton, this.getButtonStyle()]}
                onPress={this.props.onPress}
            >
                <Image source={this.getImage()} />
            </TouchableOpacity>
        );
    }
}
