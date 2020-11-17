/* eslint-disable global-require */
// @flow

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';

import UIComponent from '../UIComponent';

type ButtonImage = 'back' | 'close-primary' | 'close-secondary'
                    | 'close-dark-theme-secondary'
                    | 'close-light' | 'custom' | 'menu'
                    | 'menu-contained';

const assets = {
    back: () => UIAssets.icons.ui.arrowLeft,
    'close-primary': () => UIAssets.icons.ui.closeBlue,
    'close-secondary': () => UIAssets.icons.ui.closeGrey,
    'close-dark-theme-secondary': () =>
        UIAssets.icons.ui.closeDarkThemeSecondary,
    'close-light': () => UIAssets.icons.ui.closeLight,
    'close-black': () => UIAssets.icons.ui.closeBlack,
    menu: () => UIAssets.icons.ui.openMenu,
    'menu-contained': () => UIAssets.icons.ui.menuContained,
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
