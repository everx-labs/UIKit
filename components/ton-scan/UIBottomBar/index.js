import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
    },
});

const bottomBarStyles = [
    styles.container,
    UIStyle.centerContainer,
    UIStyle.bottomScreenContainer,
];

export default class UIBottomBar extends UIComponent {
    render() {
        return (
            <View style={bottomBarStyles}>
                <Text>{UILocalized.CopyRight}</Text>
            </View>
        );
    }
}
