// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StylePropType from 'react-style-proptype';

import UIColor from '../../../helpers/UIColor';

type Props = {
    error?: boolean,
    style?: StylePropType,
}

const styles = StyleSheet.create({
    container: {
        height: 1,
    },
});

const UISeparator = (props: Props) => {
    const color = props.color || (props.error ? UIColor.error() : UIColor.light());
    const backgroundStyle = UIColor.getBackgroundColorStyle(color);
    return <View style={[styles.container, backgroundStyle, props.style]} />;
};

export default UISeparator;

UISeparator.defaultProps = {
    error: false,
    color: null,
    style: {},
};
