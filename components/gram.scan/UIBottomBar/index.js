// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';

const styles = StyleSheet.create({
    container: {
        marginTop: UIConstant.giantContentOffset(),
        height: UIConstant.bigCellHeight(),
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
            <View style={styles.container}>
                <Text>{UILocalized.CopyRight}</Text>
            </View>
        );
    }
}
