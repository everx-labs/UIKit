import React from 'react';
import { View, StyleSheet } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

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

class UIDot extends UIComponent {
    static Type = {
        Dot: styles.dot,
        Line: styles.line,
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

UIDot.defaultProps = {
    color: UIColor.grey1(),
    type: UIDot.Type.Dot,
};
