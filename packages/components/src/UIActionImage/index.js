// @flow
import React from 'react';
import { Image, View } from 'react-native';

import { UIColor, UIStyle } from '@tonlabs/uikit.core';

import { UIActionComponent } from '../UIActionComponent';
import type { UIActionComponentProps, UIActionComponentState } from '../UIActionComponent';

type Props = UIActionComponentProps & {
    iconDisabled: string,
    iconEnabled: string,
    iconHovered: string,
};

type State = UIActionComponentState;

export default class UIActionImage extends UIActionComponent<Props, State> {
    static colorSchemes = {
        textPrimary: 'textPrimary',
        buttonPrimary: 'buttonPrimary',
    };

    static defaultProps: Props = {
        ...UIActionComponent.defaultProps,
        theme: UIColor.Theme.Light,
        style: null,
        // first type of interface - multiple sources
        iconDisabled: null,
        iconEnabled: null,
        iconHovered: null,
        // second type of interface - one source and multiple colors
        source: null,
        colorDisabled: null,
        colorEnabled: null,
        colorHovered: null,
        colorScheme: UIActionImage.colorSchemes.textPrimary,
    };

    renderColoredImage() {
        const { source, colorDisabled, colorHovered, colorEnabled, style, theme, onPress } =
            this.props;

        let color;
        const disabled = this.props.disabled || !onPress;
        if (disabled && colorDisabled) {
            color = colorDisabled;
        } else if (this.isHover() && colorHovered) {
            color = colorHovered;
        } else if (colorEnabled) {
            color = colorEnabled;
        } else if (this.props.colorScheme === UIActionImage.colorSchemes.buttonPrimary) {
            color = UIColor.buttonBackground(theme, this.isTapped(), this.isHover());
        } else {
            color = UIColor.stateTextPrimary(theme, disabled, this.isTapped(), this.isHover());
        }
        const colorStyle = color ? UIStyle.Color.getTintColorStyle(color) : null;
        return (
            <View>
                <Image source={source} style={[colorStyle, style]} />
            </View>
        );
    }

    renderContent() {
        const { iconDisabled, iconHovered, iconEnabled, disabled, source, style, children } =
            this.props;

        if (children) {
            return children;
        }

        if (source) {
            return this.renderColoredImage();
        }

        let icon;
        if (disabled) {
            icon = iconDisabled || iconEnabled;
        } else if (this.isHover()) {
            icon = iconHovered || iconEnabled;
        } else {
            icon = iconEnabled;
        }
        return <Image style={style} source={icon} />;
    }
}
