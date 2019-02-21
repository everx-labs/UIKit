// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
        paddingHorizontal: UIConstant.contentOffset(),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {};

type State = {};

export default class UIBottomBar extends UIComponent<Props, State> {
    render() {
        return (
            <View style={[styles.container, UIStyle.bottomScreenContainer]}>
                <Text style={UITextStyle.secondaryTinyRegular}>
                    {UILocalized.CopyRight}
                </Text>
            </View>
        );
    }
}
