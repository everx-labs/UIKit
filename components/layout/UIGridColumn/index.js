// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';

import UIComponent from '../../UIComponent';


const styles = StyleSheet.create({
    //
});

type Props = {
    /** @ignore */
    children?: any,
    /** how many columns to contain
    @default 1
     */
    medium: number,
    /** style
    @default null
     */
    style?: any,
};

type State = {
};

export default class UIGridColumn extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.props.children}
            </View>
        );
    }

    static defaultProps: Props;
}

UIGridColumn.defaultProps = {
    style: null,
    medium: 1,
};
