// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';

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
  style?: ?StylePropType,
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
