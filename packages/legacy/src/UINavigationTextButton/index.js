// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIComponent } from '@tonlabs/uikit.components';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

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
                <UILabel
                    color={UILabelColors.TextAccent}
                    role={UILabelRoles.ActionCallout}
                >
                    {title}
                </UILabel>
            </TouchableOpacity>
        );
    }
}
