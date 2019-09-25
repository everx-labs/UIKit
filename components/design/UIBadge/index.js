import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text } from 'react-native';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const bubbleSize = 20;

const styles = StyleSheet.create({
    container: {
        minWidth: bubbleSize,
        height: bubbleSize,
        borderRadius: bubbleSize / 2.0,
        paddingHorizontal: UIConstant.tinyContentOffset(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        ...UIFont.tinyMedium(),
        textAlign: 'center',
        letterSpacing: 0,
    },
});

export default class UIBadge extends UIComponent {
    // constructor
    constructor(props) {
        super(props);

        this.state = {
            //
        };
    }

    // Events

    // Setters

    // Getters
    getBackgroundColor() {
        return {
            backgroundColor: this.props.inverted ? UIColor.backgroundPrimary() : UIColor.primary(),
        };
    }

    getColor() {
        return {
            color: this.props.inverted ? UIColor.primary() : UIColor.backgroundPrimary(),
        };
    }

    // Actions

    // render
    render() {
        const { badge, style, textStyle } = this.props;
        if (badge === 0) return null;

        const { container, badgeText } = styles;
        return (
            <View style={[container, this.getBackgroundColor(), style]}>
                <Text style={[badgeText, this.getColor(), textStyle]}>
                    {badge}
                </Text>
            </View>
        );
    }
}

UIBadge.defaultProps = {
    style: {},
    textStyle: {},
    badge: 0,
    inverted: false,
};

UIBadge.propTypes = {
    style: StylePropType,
    textStyle: StylePropType,
    badge: PropTypes.number,
    inverted: PropTypes.bool,
};
