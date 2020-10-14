// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIColor,
    UIFont,
    UIConstant,
} from '@uikit/core';
import { UIComponent } from '@uikit/components';

const styles = StyleSheet.create({
    navButton: {
        marginHorizontal: UIConstant.contentOffset(),
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    textButton: {
        ...UIFont.smallMedium(),
        color: UIColor.primary(),
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
                <Text style={styles.textButton}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }
}
