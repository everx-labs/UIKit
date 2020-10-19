// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIColor, UIConstant } from '@uikit/core';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    iconContainer: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        height: UIConstant.tinyIconSize(),
        borderRadius: UIConstant.tinyBorderRadius(),
    },
    dot: {
        width: UIConstant.tinyIconSize(),
    },
    line: {
        width: UIConstant.iconSize(),
    },
});

type Props = {
    color: string,
    type: ViewStyleProp,
    iconContainer?: ViewStyleProp,
}

class UIDot extends UIComponent<Props, null> {
    static Type = {
        Dot: styles.dot,
        Line: styles.line,
    };

    static defaultProps = {
        color: UIColor.grey1(),
        type: UIDot.Type.Dot,
    };

    render() {
        const { color, type } = this.props;
        const colorStyle = UIColor.getBackgroundColorStyle(color);
        return (
            <View style={[styles.iconContainer, this.props.iconContainer]}>
                <View style={[styles.circle, colorStyle, type]} />
            </View>
        );
    }
}

export default UIDot;