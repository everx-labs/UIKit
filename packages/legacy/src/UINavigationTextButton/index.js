// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIColor, UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { Typography, TypographyVariants } from '@tonlabs/uikit.hydrogen';

const styles = StyleSheet.create({
    navButton: {
        marginHorizontal: UIConstant.contentOffset(),
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

type Props = {
    containerStyle: ViewStyleProp,
    onPress: () => void,
    disabled: boolean,
    title: string,
    testID?: string,
};

type State = {};

export default class UINavigationTextButton extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        onPress: () => {},
        disabled: false,
        title: null,
    };

    // Render
    render() {
        const {
            testID, containerStyle, onPress, disabled, title,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableOpacity
                {...testIDProp}
                disabled={disabled}
                style={[styles.navButton, containerStyle]}
                onPress={onPress}
            >
                <Text style={[Typography[TypographyVariants.ActionCallout], UIStyle.color.getColorStyle(UIColor.textAccent())]}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }
}
