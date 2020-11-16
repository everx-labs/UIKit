// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIColor } from '@tonlabs/uikit.core';

type Props = {
    vertical?: boolean,
    error?: boolean,
    color?: ?string,
    style?: ViewStyleProp,
}

const styles = StyleSheet.create({
    horizontal: {
        height: 1,
    },
    vertical: {
        width: 1,
    },
});

const UISeparator = (props: Props) => {
    const color = props.color || (props.error ? UIColor.error() : UIColor.light());
    const backgroundStyle = UIColor.getBackgroundColorStyle(color);
    const style = props.vertical ? styles.vertical : styles.horizontal;
    return <View style={[style, backgroundStyle, props.style]} />;
};

export default UISeparator;

UISeparator.defaultProps = {
    vertical: false,
    error: false,
    color: null,
    style: {},
};
