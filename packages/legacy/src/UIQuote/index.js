// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { View, StyleSheet } from 'react-native';

import { UIConstant, UIColor } from '@uikit/core';
import { UIComponent } from '@uikit/components';

const styles = StyleSheet.create({
    quote: {
        borderLeftColor: UIColor.grey3(),
        borderLeftWidth: 1,
        padding: UIConstant.contentOffset(),
    },
});

type Props = {
  /** React children
  @default null
  */
  children?: any,
  /** Custom style
  @default null
  */
  style?: ?ViewStyleProp,
};

type State = {};

export default class UIQuote extends UIComponent<Props, State> {
    // Render
    render() {
        return (
            <View style={[styles.quote, this.props.style]}>
                {this.props.children}
            </View>
        );
    }

    static defaultProps: Props;
}

UIQuote.defaultProps = {
    style: null,
    children: null,
};
