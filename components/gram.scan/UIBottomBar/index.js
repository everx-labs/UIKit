// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
        paddingHorizontal: UIConstant.contentOffset(),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

type Props = {
    text: string,
    screenWidth: number,
};

type State = {};

export default class UIBottomBar extends UIComponent<Props, State> {
    render() {
        const { screenWidth, text } = this.props;
        const copyRight = screenWidth > UIConstant.elasticWidthWide()
            ? '2018–2019 © TON.Labs'
            : '©';
        return (
            <View style={[styles.container, UIStyle.bottomScreenContainer]}>
                <Text style={UITextStyle.secondaryTinyRegular}>
                    {text}
                </Text>
                <Text style={UITextStyle.secondaryTinyRegular}>
                    {copyRight}
                </Text>
            </View>
        );
    }

    static defaultProps: Props;
}

UIBottomBar.defaultProps = {
    text: '',
    screenWidth: 0,
};

